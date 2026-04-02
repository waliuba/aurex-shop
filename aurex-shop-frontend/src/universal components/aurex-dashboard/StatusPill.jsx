const statusTone = {
  processing: 'mdPill--processing',
  shipped: 'mdPill--shipped',
  delivered: 'mdPill--delivered',
  pending: 'mdPill--pending',
};

const StatusPill = ({ status }) => {
  const s = String(status || '').toLowerCase();
  const klass = statusTone[s] || 'mdPill--pending';
  return <span className={['mdPill', klass].join(' ')}>{s || 'pending'}</span>;
};

export default StatusPill;

