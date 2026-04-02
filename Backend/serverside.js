import 'dotenv/config';

import express from 'express';
import connectDB from './config/axdb.js';

const app = express();

// connect database

connectDB();

// middleware

app.use(express.json());

// routes
import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);

// test route
app.get('/', (req, res) => {
  res.send('API is running ');
});

// server
const PORT = process.env.PORT || 5000;
