const PermissionToggle = ({ label, description, checked, disabled, onChange }) => {
  return (
    <div className="adminPermRow">
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 800 }}>{label}</div>
        {description ? <div className="uiHelpText">{description}</div> : null}
      </div>
      <label className={`uiSwitch${disabled ? ' uiSwitch--disabled' : ''}`}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange?.(e.target.checked)} disabled={disabled} />
        <span className="uiSwitch__track" aria-hidden="true">
          <span className="uiSwitch__thumb" />
        </span>
      </label>
    </div>
  );
};

export default PermissionToggle;

