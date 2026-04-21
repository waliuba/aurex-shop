const StatCard = ({ label, value, hint }) => {
  return (
    <div className="tw-rounded-3xl tw-border tw-border-slate-200 dark:tw-border-slate-800 tw-bg-white dark:tw-bg-slate-950 tw-p-5 tw-shadow-soft">
      <div className="tw-text-sm tw-text-slate-600 dark:tw-text-slate-300">{label}</div>
      <div className="tw-mt-1 tw-text-2xl tw-font-semibold tw-tracking-tight">{value}</div>
      {hint ? <div className="tw-mt-1 tw-text-xs tw-text-slate-500 dark:tw-text-slate-400">{hint}</div> : null}
    </div>
  );
};

export default StatCard;

