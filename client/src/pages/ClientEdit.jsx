import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getClient, updateClient } from '../api/clients';
import ClientForm from '../components/ClientForm';

export default function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getClient(id)
      .then((res) => setClient(res.data))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await updateClient(id, data);
      navigate(`/clients/${id}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-slate-500">Loading…</div>;
  if (!client) return <div className="p-8 text-red-500">Client not found</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <nav className="text-sm text-slate-400">
        <Link to="/clients" className="hover:text-indigo-600">Clients</Link>
        <span className="mx-2">/</span>
        <Link to={`/clients/${id}`} className="hover:text-indigo-600">{client.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Edit</span>
      </nav>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h1 className="text-xl font-bold text-slate-800 mb-6">Edit Client</h1>
        <ClientForm
          initial={client}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/clients/${id}`)}
          loading={loading}
        />
      </div>
    </div>
  );
}
