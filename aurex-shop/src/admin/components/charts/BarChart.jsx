const BarChart = ({ data, height = 140 }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height }}>
        {data.map((d) => {
          const pct = Math.max(0.08, d.value / max);
          return (
            <div key={d.label} style={{ flex: 1, display: 'grid', gap: 6, alignItems: 'end' }}>
              <div
                style={{
                  height: `${pct * 100}%`,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'linear-gradient(180deg, rgba(200,169,106,0.95), rgba(200,169,106,0.15))',
                }}
                title={`${d.label}: ${d.value}`}
              />
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.62)', textAlign: 'center' }}>{d.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;

