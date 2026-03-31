import Button from '../../Button';
import ProductCard from '../../ProductCard';

const Wishlist = ({ items = [], onRemove, onAddToCart, limit }) => {
  const list = limit ? items.slice(0, limit) : items;

  return (
    <section className="mdCard">
      <div className="mdSectionHeader">
        <div>
          <div className="mdSectionTitle">Saved items</div>
          <div className="mdMuted">Suits you liked but didn’t buy.</div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mdMuted">No saved items yet.</div>
      ) : (
        <div className="mdGrid">
          {list.map((p) => (
            <div key={p.sku} className="mdWishlistItem">
              <ProductCard
                name={p.name}
                sku={p.sku}
                stock={p.stock}
                swatch={p.swatch}
                price={p.price}
                onAddToCart={() => onAddToCart(p)}
              />
              <div className="mdWishlistActions">
                <Button variant="outline" onClick={() => onRemove(p.sku)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Wishlist;

