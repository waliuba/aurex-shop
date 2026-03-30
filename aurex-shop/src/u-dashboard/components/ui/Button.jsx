const Button = ({
  variant = 'primary',
  type = 'button',
  disabled,
  onClick,
  children,
  className = '',
  ...rest
}) => {
  const classes = ['mdBtn', variant === 'outline' ? 'mdBtn--outline' : 'mdBtn--primary', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

export default Button;

