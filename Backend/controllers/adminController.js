import Order from '../modules/ordersmodule.js';
import Product from '../modules/productmodule.js';
import User from '../modules/User.js';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const getDashboard = async (req, res) => {
  try {
    const [orders, customersCount, lowStock] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).limit(1000),
      User.countDocuments({ role: { $ne: 'admin' } }),
      Product.countDocuments({ countInStock: { $lte: 3 } }),
    ]);

    const totalSales = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
    const today = startOfDay(new Date());
    const revenueToday = orders
      .filter((o) => o.createdAt && o.createdAt >= today)
      .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

    // Revenue per day (last 7 days)
    const revenue = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = startOfDay(d);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const value = orders
        .filter((o) => o.createdAt && o.createdAt >= start && o.createdAt < end)
        .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

      revenue.push({ label: dayLabels[start.getDay()], value });
    }

    const activity = orders.slice(0, 6).map((o) => ({
      id: o._id.toString(),
      message: `Order ${o._id.toString().slice(-6)} is ${o.status || 'Pending'}`,
      at: o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 16).replace('T', ' ') : '',
    }));

    return res.json({
      metrics: {
        totalSales,
        orders: orders.length,
        customers: customersCount,
        revenueToday,
        lowStock,
      },
      revenue,
      activity,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

