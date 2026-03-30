import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getClients, deleteClient } from '../api/clients';
import StatusBadge from '../components/StatusBadge';
import { exportToCsv } from '../utils/exportCsv';

const STATUSES = ['all', 'active', 'inactive', 'lead'];

export default function ClientList() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (search) params.search = search;
      if (status !== 'all') params.status = status;
      const res = await getClients(params);
      setClients(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(fetchClients, 300);
    return () => clearTimeout(t);
  }, [fetchClients]);

  const handleExportView = () => {
    const filename = search || status !== 'all'
      ? `clients-filtered-${Date.now()}.csv`
      : 'clients.csv';
    exportToCsv(clients, filename);
  };

  const handleExportAll = async () => {
    setExporting(true);
    try {
      const res = await getClients({ limit: 10000 });
      exportToCsv(res.data, 'clients-all.csv');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c._id !== id));
      setTotal((t) => t - 1);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Clients</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} total</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportView}
            disabled={clients.length === 0}
            title="Export current filtered view"
            className="px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Export View
          </button>
          <button
            onClick={handleExportAll}
            disabled={exporting}
            title="Export all clients regardless of filters"
            className="px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-40 transition-colors"
          >
            {exporting ? 'Exporting…' : 'Export All'}
          </button>
          <Link
            to="/clients/new"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Add Client
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, email, or company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                status === s ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No clients found.{' '}
            {!search && status === 'all' && (
              <Link to="/clients/new" className="text-indigo-600 hover:underline">Add your first client</Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Company</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-xs uppercase flex-shrink-0">
                          {c.name[0]}
                        </div>
                        <button
                          onClick={() => navigate(`/clients/${c._id}`)}
                          className="font-medium text-slate-800 hover:text-indigo-600 text-left"
                        >
                          {c.name}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 truncate max-w-[180px]">{c.email}</td>
                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{c.company || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/clients/${c._id}/edit`}
                          className="text-xs px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(c._id, c.name)}
                          disabled={deleting === c._id}
                          className="text-xs px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 disabled:opacity-50 transition-colors"
                        >
                          {deleting === c._id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
