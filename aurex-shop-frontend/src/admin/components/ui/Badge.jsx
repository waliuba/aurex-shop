const Badge = ({ children, tone = 'default' }) => {
  const toneClass =
    tone === 'ok' ? 'uiBadge--ok' : tone === 'warn' ? 'uiBadge--warn' : tone === 'danger' ? 'uiBadge--danger' : '';
  return <span className={`uiBadge ${toneClass}`}>{children}</span>;
};

export default Badge;

