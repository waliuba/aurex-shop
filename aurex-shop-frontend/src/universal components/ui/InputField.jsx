import './input_field.css';

const InputField = ({ placeholder, value, onChange, className = '', ...rest }) => {
  return (
    <input
      className={['uInput', className].filter(Boolean).join(' ')}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default InputField;

