import { useEffect, useState, useRef, useCallback } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../api/notes';

function timeAgo(date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

function snippet(content) {
  const text = (content || '').replace(/\s+/g, ' ').trim();
  return text ? text.slice(0, 80) : 'No additional text';
}

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState('saved'); // 'saved' | 'saving' | 'dirty'

  const saveTimer = useRef(null);

  const active = notes.find((n) => n._id === activeId) || null;

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      const res = await getNotes(params);
      setNotes(res.data);
      setActiveId((cur) => (cur && res.data.some((n) => n._id === cur) ? cur : res.data[0]?._id || null));
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchNotes, 300);
    return () => clearTimeout(t);
  }, [fetchNotes]);

  // Load the active note into the editable draft when selection changes.
  useEffect(() => {
    if (active) setDraft({ title: active.title, content: active.content });
    setSaveState('saved');
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced autosave whenever the draft changes.
  const scheduleSave = (next) => {
    setDraft(next);
    setSaveState('dirty');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (!activeId) return;
      setSaveState('saving');
      try {
        const res = await updateNote(activeId, next);
        setNotes((prev) =>
          prev.map((n) => (n._id === activeId ? res.data : n)).sort(sortNotes)
        );
        setSaveState('saved');
      } catch {
        setSaveState('dirty');
      }
    }, 600);
  };

  const handleNew = async () => {
    const res = await createNote({ title: '', content: '' });
    setNotes((prev) => [res.data, ...prev]);
    setActiveId(res.data._id);
    setDraft({ title: res.data.title, content: res.data.content });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    await deleteNote(id);
    setNotes((prev) => {
      const remaining = prev.filter((n) => n._id !== id);
      if (id === activeId) setActiveId(remaining[0]?._id || null);
      return remaining;
    });
  };

  const togglePin = async (note) => {
    const res = await updateNote(note._id, { pinned: !note.pinned });
    setNotes((prev) => prev.map((n) => (n._id === note._id ? res.data : n)).sort(sortNotes));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notes</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your personal space for thoughts</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + New Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-180px)]">
        {/* Sidebar list */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100">
            <input
              type="text"
              placeholder="Search notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-slate-400 text-sm">Loading…</div>
            ) : notes.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">
                No notes yet.{' '}
                <button onClick={handleNew} className="text-indigo-600 hover:underline">
                  Create one
                </button>
              </div>
            ) : (
              notes.map((n) => (
                <button
                  key={n._id}
                  onClick={() => setActiveId(n._id)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-50 transition-colors ${
                    n._id === activeId ? 'bg-indigo-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {n.pinned && <span className="text-amber-500 text-xs">📌</span>}
                    <span className="font-medium text-slate-800 text-sm truncate">
                      {n.title || 'Untitled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{snippet(n.content)}</p>
                  <p className="text-[11px] text-slate-300 mt-1">{timeAgo(n.updatedAt)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {!active ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Select a note or create a new one.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <span className="text-xs text-slate-400">
                  {saveState === 'saving' ? 'Saving…' : saveState === 'dirty' ? 'Unsaved changes' : 'Saved'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePin(active)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                      active.pinned
                        ? 'border-amber-300 text-amber-600 bg-amber-50'
                        : 'border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600'
                    }`}
                  >
                    {active.pinned ? 'Pinned' : 'Pin'}
                  </button>
                  <button
                    onClick={() => handleDelete(active._id)}
                    className="text-xs px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden px-6 py-4">
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => scheduleSave({ ...draft, title: e.target.value })}
                  placeholder="Untitled"
                  className="text-2xl font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none mb-3"
                />
                <textarea
                  value={draft.content}
                  onChange={(e) => scheduleSave({ ...draft, content: e.target.value })}
                  placeholder="Start writing your thoughts…"
                  className="flex-1 resize-none text-slate-700 leading-relaxed focus:outline-none placeholder:text-slate-300"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function sortNotes(a, b) {
  if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
  return new Date(b.updatedAt) - new Date(a.updatedAt);
}
