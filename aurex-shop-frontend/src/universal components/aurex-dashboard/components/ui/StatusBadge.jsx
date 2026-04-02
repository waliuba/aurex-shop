const statusTone = {
  pending: 'mdPill--pending',
  delivered: 'mdPill--delivered',
  cancelled: 'mdPill--cancelled',
};

const StatusBadge = ({ status }) => {
  const s = String(status || '').toLowerCase();
  const klass = statusTone[s] || 'mdPill--pending';
  return <span className={['mdPill', klass].join(' ')}>{s || 'pending'}</span>;
};

export default StatusBadge;

