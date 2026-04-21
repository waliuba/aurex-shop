import 'dotenv/config';
import express from 'express';
import connectDB from './config/axdb.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productroute from './routes/productroute.js';
import ordersroute from './routes/ordersroute.js';

const app = express();

// connect database

connectDB();

// middleware
// Product creation currently sends images as base64 data URLs from the admin UI.
// Base64 payloads are significantly larger than the original file size, so allow
// a larger request body to avoid 413 Payload Too Large for valid product uploads.
const REQUEST_BODY_LIMIT = '50mb';

app.use(express.json({ limit: REQUEST_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: REQUEST_BODY_LIMIT }));

// routes

// Authroutes
app.use('/api/auth', authRoutes);
// Admin routes
app.use('/api/admin', adminRoutes);
// Users routes (admin only)
app.use('/api/users', userRoutes);
// products route.
app.use('/api/products', productroute);
// orders route
app.use('/api/orders', ordersroute);

// test route
app.get('/', (req, res) => {
  res.send('API is running ');
});

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
