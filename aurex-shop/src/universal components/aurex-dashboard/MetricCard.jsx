const arrows = {
  up: '\u25B2',
  down: '\u25BC',
  flat: '\u2022',
};

const MetricCard = ({ label, value, change, direction = 'up' }) => {
  const tone =
    direction === 'down' ? 'mdMetric__change--down' : direction === 'flat' ? 'mdMetric__change--flat' : 'mdMetric__change--up';
  const arrow = arrows[direction] || arrows.up;

  return (
    <div className="mdMetric">
      <div className="mdMetric__label">{label}</div>
      <div className="mdMetric__value">{value}</div>
      {change !== undefined && change !== null ? (
        <div className={['mdMetric__change', tone].join(' ')}>
          {arrow} {change}
        </div>
      ) : null}
    </div>
  );
};

export default MetricCard;

