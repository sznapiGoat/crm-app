import { useState } from 'react';

const EMPTY = { name: '', email: '', phone: '', company: '', status: 'lead', notes: '' };

export default function ClientForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState([]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      await onSubmit(form);
    } catch (err) {
      const msgs = err.response?.data?.errors || [err.response?.data?.message || 'Something went wrong'];
      setErrors(msgs);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-red-600">{e}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name *" value={form.name} onChange={set('name')} placeholder="Jane Doe" />
        <Field label="Email *" value={form.email} onChange={set('email')} type="email" placeholder="jane@example.com" />
        <Field label="Phone" value={form.phone} onChange={set('phone')} placeholder="+1 555 000 0000" />
        <Field label="Company" value={form.company} onChange={set('company')} placeholder="Acme Corp" />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            value={form.status}
            onChange={set('status')}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
        <textarea
          value={form.notes}
          onChange={set('notes')}
          rows={4}
          placeholder="Any additional notes..."
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {loading ? 'Saving…' : 'Save Client'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
