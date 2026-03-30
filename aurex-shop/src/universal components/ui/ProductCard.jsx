import Btn from './btns';
import './product_card.css';

const ProductCard = ({ name, sku, stock, swatchColor, onAddToCart }) => {
  const canAdd = Number(stock) > 0;

  return (
    <article className="uProductCard card">
      <div className="uProductCard__top">
        <div>
          <h3 className="uProductCard__name">{name}</h3>
          <div className="uProductCard__sku">SKU: {sku}</div>
        </div>
        <div className="uProductCard__swatchWrap" title={swatchColor || ''} aria-label="Fabric swatch">
          <span className="uProductCard__swatch" style={{ background: swatchColor || '#ced1c8' }} />
        </div>
      </div>

      <div className="uProductCard__meta">
        <span className={canAdd ? 'uStock uStock--ok' : 'uStock uStock--out'}>
          {canAdd ? `${stock} in stock` : 'Out of stock'}
        </span>
      </div>

      <div className="uProductCard__actions">
        <Btn onClick={onAddToCart} disabled={!canAdd} variant={canAdd ? 'primary' : 'secondary'}>
          Add to cart
        </Btn>
      </div>
    </article>
  );
};

export default ProductCard;

