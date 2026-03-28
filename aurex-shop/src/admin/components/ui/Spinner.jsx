const Spinner = ({ label = 'Loading' }) => {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span className="uiSpinner" aria-hidden="true" />
      <span className="uiHelpText">{label}</span>
    </span>
  );
};

export default Spinner;

