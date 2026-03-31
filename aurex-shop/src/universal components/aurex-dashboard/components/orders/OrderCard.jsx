import StatusBadge from '../ui/StatusBadge';

const money = (n) => `$${Number(n || 0).toLocaleString()}`;

const OrderCard = ({ order }) => {
  return (
    <div className="mdOrderCard">
      <div className="mdOrderCard__left">
        <div className="mdOrderCard__id">{order.id}</div>
        <div className="mdMuted">{order.date}</div>
      </div>

      <div className="mdOrderCard__right">
        <div className="mdOrderCard__total">{money(order.total)}</div>
        <StatusBadge status={order.status} />
      </div>
    </div>
  );
};

export default OrderCard;

