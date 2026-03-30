const MetricCard = ({ label, value, change, direction = 'up' }) => {
  const dir = direction === 'down' ? 'mdMetric__change--down' : direction === 'flat' ? 'mdMetric__change--flat' : 'mdMetric__change--up';
  const arrow = direction === 'down' ? '▼' : direction === 'flat' ? '•' : '▲';

  return (
    <div className="mdMetric">
      <div className="mdMetric__label">{label}</div>
      <div className="mdMetric__value">{value}</div>
      {change !== undefined && change !== null ? (
        <div className={['mdMetric__change', dir].join(' ')}>
          {arrow} {change}
        </div>
      ) : null}
    </div>
  );
};

export default MetricCard;

