const Input = ({
  label,
  helpText,
  error,
  as = 'input',
  className = '',
  children,
  ...rest
}) => {
  const Field = as;
  return (
    <div className={`uiInput ${className}`}>
      {label ? <label>{label}</label> : null}
      {as === 'select' ? (
        <select {...rest}>{children}</select>
      ) : (
        <Field {...rest} />
      )}
      {error ? <div className="uiErrorText">{error}</div> : null}
      {helpText ? <div className="uiHelpText">{helpText}</div> : null}
    </div>
  );
};

export default Input;

