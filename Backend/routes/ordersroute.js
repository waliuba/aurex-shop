import express from 'express';
import Order from '../modules/ordersmodule.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// CREATE ORDER
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice, status } = req.body;

    if (!orderItems || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      ...(status ? { status } : {}),
    });

    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// READ (MY ORDERS) - authenticated user
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// READ (ALL) ORDERS
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// READ (ORDERS FOR A USER) - admin only
router.get('/user/:userId', protect, requireRole('admin'), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// UPDATE ORDER STATUS - admin only
router.put('/:id/status', protect, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    const updated = await order.save();
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// READ (SINGLE) ORDER
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Admin can read any order; users can only read their own order
    if (req.user.role !== 'admin' && order.user?._id?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
