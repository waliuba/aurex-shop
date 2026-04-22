export function highlight(text, query) {
  const q = String(query || '').trim();
  const source = String(text || '');
  if (!q) return source;

  const lower = source.toLowerCase();
  const lowerQ = q.toLowerCase();
  const idx = lower.indexOf(lowerQ);
  if (idx < 0) return source;

  const before = source.slice(0, idx);
  const match = source.slice(idx, idx + q.length);
  const after = source.slice(idx + q.length);

  return (
    <>
      {before}
      <mark className="tw-rounded tw-bg-amber-200/70 tw-px-1 tw-text-slate-900">{match}</mark>
      {after}
    </>
  );
}

