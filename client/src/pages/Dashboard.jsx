import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getClients } from '../api/clients';
import StatusBadge from '../components/StatusBadge';

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-1`}>
    <p className="text-sm text-slate-500 font-medium">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value ?? '—'}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getClients({ limit: 5 })])
      .then(([s, c]) => {
        setStats(s.data);
        setRecent(c.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500">Loading dashboard…</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your CRM</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Clients" value={stats?.total} color="text-slate-800" />
        <StatCard label="Active" value={stats?.active} color="text-emerald-600" />
        <StatCard label="Leads" value={stats?.lead} color="text-amber-600" />
        <StatCard label="Inactive" value={stats?.inactive} color="text-slate-500" />
      </div>

      {/* Recent Clients */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-700">Recent Clients</h2>
          <Link to="/clients" className="text-sm text-indigo-600 hover:underline">View all →</Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">
            No clients yet.{' '}
            <Link to="/clients/new" className="text-indigo-600 hover:underline">Add one</Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((c) => (
              <li key={c._id}>
                <Link to={`/clients/${c._id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors">
                  <div className="size-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm uppercase flex-shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{c.name}</p>
                    <p className="text-xs text-slate-400 truncate">{c.company || c.email}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
