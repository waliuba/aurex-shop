import OrderCard from './OrderCard';

const OrderHistory = ({ orders = [], limit }) => {
  const list = limit ? orders.slice(0, limit) : orders;

  return (
    <section className="mdCard">
      <div className="mdSectionHeader">
        <div>
          <div className="mdSectionTitle">Order history</div>
          <div className="mdMuted">The heartbeat of trust in an online store.</div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mdMuted">No orders yet.</div>
      ) : (
        <div className="mdOrderList">
          {list.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </section>
  );
};

export default OrderHistory;

