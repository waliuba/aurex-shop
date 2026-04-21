const Skeleton = ({ className = '' }) => {
  return <div className={['tw-animate-pulse tw-rounded-2xl tw-bg-slate-100 dark:tw-bg-slate-900', className].join(' ')} />;
};

export default Skeleton;

