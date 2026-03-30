import Button from './Button';

const ProductCard = ({ name, sku, stock, swatch, onAddToCart, price }) => {
  const canAdd = Number(stock) > 0;
  return (
    <div className="mdProductCard">
      <div className="mdProductCard__row">
        <div>
          <div className="mdProductCard__name">{name}</div>
          <div className="mdProductCard__sku">SKU: {sku}</div>
        </div>
        <div className="mdProductCard__swatchWrap" title={swatch || ''}>
          <span className="mdProductCard__swatch" style={{ background: swatch || '#999' }} />
        </div>
      </div>
      <div className="mdProductCard__meta">
        <span className={canAdd ? 'mdOk' : 'mdWarn'}>{canAdd ? `${stock} in stock` : 'Out of stock'}</span>
        {price !== undefined ? <span className="mdMuted">${Number(price).toFixed(0)}</span> : null}
      </div>
      <div className="mdProductCard__actions">
        <Button variant={canAdd ? 'primary' : 'outline'} disabled={!canAdd} onClick={onAddToCart}>
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;

