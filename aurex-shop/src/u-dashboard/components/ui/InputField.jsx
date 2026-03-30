const InputField = ({ placeholder, value, onChange, className = '', ...rest }) => {
  return (
    <input
      className={['mdInput', className].filter(Boolean).join(' ')}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default InputField;

