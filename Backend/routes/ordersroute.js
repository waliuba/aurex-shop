import express from 'express';
import orders from '../models/ordersmodule.js';

router.post('/', async (req, res) => {
  try {
    const {
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    } = req.body;

    const order = new order({
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const router = express.Router();
