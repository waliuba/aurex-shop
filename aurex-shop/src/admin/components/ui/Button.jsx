const Button = ({
  children,
  variant = 'primary',
  href,
  type = 'button',
  onClick,
  disabled,
  className = '',
  ...rest
}) => {
  const classes = `uiButton uiButton--${variant}${className ? ` ${className}` : ''}`;

  if (href) {
    return (
      <a className={classes} href={href} aria-disabled={disabled ? 'true' : undefined} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type={type} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default Button;
