const Skeleton = ({ height = 14, width = '100%', style }) => {
  return <div className="uiSkeleton" style={{ height, width, ...style }} aria-hidden="true" />;
};

export default Skeleton;

