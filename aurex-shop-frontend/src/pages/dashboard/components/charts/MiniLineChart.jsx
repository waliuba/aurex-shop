import { useMemo } from 'react';

function MiniLineChart({ data, height = 90 }) {
  const points = useMemo(() => {
    const values = data.map((d) => d.value);
    const max = Math.max(1, ...values);
    const min = Math.min(0, ...values);
    const range = Math.max(1, max - min);
    const w = Math.max(1, data.length - 1);

    return data.map((d, i) => {
      const x = (i / w) * 100;
      const y = 100 - ((d.value - min) / range) * 100;
      return { x, y, ...d };
    });
  }, [data]);

  const path = useMemo(() => {
    if (!points.length) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [points]);

  return (
    <svg viewBox="0 0 100 100" width="100%" height={height} preserveAspectRatio="none" className="tw-block">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="3" className="tw-text-brand-secondary" />
      <path d={`${path} L 100 100 L 0 100 Z`} fill="currentColor" className="tw-text-brand-secondary/10" />
    </svg>
  );
}

export default MiniLineChart;

