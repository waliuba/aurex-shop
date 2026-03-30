import colorstring from '../colorstrings';
import fonts from '../fonts';
import sizes from '../sizes';
import './btns.css';
 
const Btn = ({
  variant = 'primary',
  block = false,
  href,
  type = 'button',
  className = '',
  style,
  children,
  ...rest
}) => {
  const classes = [
    'btn',
    variant === 'secondary'
      ? 'btn--secondary'
      : variant === 'ghost'
        ? 'btn--ghost'
        : 'btn--primary',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const mergedStyle = {
    '--btn-radius': `${sizes.buttons.radius}px`,
    '--btn-padding-y': `${sizes.buttons.paddingY}px`,
    '--btn-padding-x': `${sizes.buttons.paddingX}px`,
    '--btn-font-size': `${sizes.buttons.fontSize}px`,
    '--btn-font': fonts.FontFamily.btns,
    '--btn-primary-bg': colorstring.buttons.btn2,
    '--btn-primary-fg': colorstring.buttons.btn1,
    '--btn-secondary-border': colorstring.brand.third,
    '--btn-secondary-fg': colorstring.brand.secondary,
    '--btn-ghost-fg': colorstring.brand.secondary,
    ...style,
  };

  if (href) {
    return (
      <a className={classes} href={href} style={mergedStyle} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      type={type}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Btn;
