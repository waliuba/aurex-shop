import sizes from '../../../universal components/sizes';
import colorstring from '../../../universal components/colorstrings';

const BarChart = ({ data, height = sizes.admin.charts.barHeight }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div style={{ display: 'grid', gap: sizes.admin.charts.barGap }}>
      <div style={{ display: 'flex', gap: sizes.admin.charts.barGap, alignItems: 'flex-end', height }}>
        {data.map((d) => {
          const pct = Math.max(0.08, d.value / max);
          return (
            <div key={d.label} style={{ flex: 1, display: 'grid', gap: sizes.admin.charts.barLabelGap, alignItems: 'end' }}>
              <div
                style={{
                  height: `${pct * 100}%`,
                  borderRadius: sizes.admin.charts.barRadius,
                  border: `1px solid ${colorstring.admin.border}`,
                  background: `linear-gradient(180deg, ${colorstring.admin.gradient.start}, ${colorstring.admin.gradient.end})`,
                }}
                title={`${d.label}: ${d.value}`}
              />
              <div style={{ fontSize: sizes.admin.charts.barLabelFontSize, color: colorstring.admin.muted, textAlign: 'center' }}>
                {d.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;
