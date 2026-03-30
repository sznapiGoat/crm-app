import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createClient } from '../api/clients';
import ClientForm from '../components/ClientForm';

export default function ClientNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await createClient(data);
      navigate(`/clients/${res.data._id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <nav className="text-sm text-slate-400">
        <Link to="/clients" className="hover:text-indigo-600">Clients</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">New Client</span>
      </nav>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h1 className="text-xl font-bold text-slate-800 mb-6">Add New Client</h1>
        <ClientForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/clients')}
          loading={loading}
        />
      </div>
    </div>
  );
}
