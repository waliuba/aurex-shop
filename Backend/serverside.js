import 'dotenv/config';
import express from 'express';
import connectDB from './config/axdb.js';
import authRoutes from './routes/authRoutes.js';
import productroute from './routes/productroute.js';

const app = express();

// connect database

connectDB();

// middleware

app.use(express.json());

// routes

// Authroutes
app.use('/api/auth', authRoutes);
// products route.
app.use('/api/products', productroute);

// test route
app.get('/', (req, res) => {
  res.send('API is running ');
});

// server
const PORT = process.env.PORT || 5000;
