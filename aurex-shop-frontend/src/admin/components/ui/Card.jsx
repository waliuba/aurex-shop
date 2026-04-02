const Card = ({ title, action, children, className = '' }) => {
  return (
    <section className={`uiCard ${className}`}>
      {(title || action) && (
        <header className="uiCardHeader">
          <div>
            {title && <h2 className="uiCardTitle">{title}</h2>}
          </div>
          {action ? <div>{action}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
};

export default Card;

