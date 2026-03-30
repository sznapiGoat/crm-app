import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getClient, deleteClient } from '../api/clients';
import StatusBadge from '../components/StatusBadge';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getClient(id)
      .then((res) => setClient(res.data))
      .catch(() => setError('Client not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${client.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await deleteClient(id);
    navigate('/clients');
  };

  if (loading) return <div className="p-8 text-slate-500">Loading…</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400">
        <Link to="/clients" className="hover:text-indigo-600">Clients</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{client.name}</span>
      </nav>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl uppercase flex-shrink-0">
              {client.name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{client.name}</h1>
              {client.company && <p className="text-slate-500 mt-0.5">{client.company}</p>}
              <div className="mt-2"><StatusBadge status={client.status} /></div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link
              to={`/clients/${id}/edit`}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 disabled:opacity-50 transition-colors"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-700">Contact Information</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Email" value={client.email} />
          <InfoRow label="Phone" value={client.phone || '—'} />
          <InfoRow label="Company" value={client.company || '—'} />
          <InfoRow
            label="Added"
            value={new Date(client.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          />
        </dl>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
        <h2 className="font-semibold text-slate-700">Notes</h2>
        {client.notes ? (
          <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{client.notes}</p>
        ) : (
          <p className="text-slate-400 text-sm italic">No notes added yet.</p>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">{label}</dt>
      <dd className="text-slate-700 text-sm">{value}</dd>
    </div>
  );
}
