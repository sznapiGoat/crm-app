const styles = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-100 text-slate-600',
  lead: 'bg-amber-100 text-amber-700',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[status] || styles.lead}`}>
      {status}
    </span>
  );
}
