import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from '../backend/routes/auth.routes.js';
import productRoutes from '../backend/routes/product.routes.js';
import userRoutes from '../backend/routes/user.routes.js';
import orderRoutes from '../backend/routes/order.routes.js';

import connectToMongoDB from './db/connectToMongoDB.js';

// configuring dotenv so that all necessary variables are available
dotenv.config();

// Validate required environment variables

// initiating express
const app = express();

// configuring ports
const PORT = process.env.PORT || 5000;

// middleeware
app.use(express.json());
app.use(cookieParser());

//routing
app.use('/api/auth', authRoutes); // auth routes
app.use('/api/product', productRoutes); // product routes
app.use('/api/user', userRoutes); // Users routes
app.use('/api/order', orderRoutes); // Orders routes

// app listens to port and connects to mongodb
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
