const COLUMNS = ['name', 'email', 'phone', 'company', 'status', 'createdAt'];
const HEADERS = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Created At'];

function escapeCell(value) {
  if (value == null) return '';
  const str = String(value);
  // Wrap in quotes if the value contains a comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCsv(clients, filename = 'clients.csv') {
  const rows = [
    HEADERS.join(','),
    ...clients.map((c) =>
      COLUMNS.map((col) => {
        const val = col === 'createdAt'
          ? new Date(c[col]).toLocaleDateString('en-US')
          : c[col];
        return escapeCell(val);
      }).join(',')
    ),
  ];

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
