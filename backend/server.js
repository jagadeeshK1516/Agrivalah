const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
require('express-async-errors');
require('dotenv').config();

const logger = require('./src/utils/logger');
const errorHandler = require('./src/middlewares/errorHandler');
const { swaggerDocs, swaggerUi, swaggerUiOptions } = require('./src/docs/swagger');

// Import routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const sellerRoutes = require('./src/routes/sellers');
const productRoutes = require('./src/routes/products');
const orderRoutes = require('./src/routes/orders');
const adminRoutes = require('./src/routes/admin');
const uploadRoutes = require('./src/routes/upload');
const searchRoutes = require('./src/routes/search');

const app = express();
const PORT = process.env.PORT || 8001;

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Disable for development - configure properly in production
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Auth-specific rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX) || 5,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/v1/auth', authLimiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Data sanitization middleware
app.use(mongoSanitize()); // Against NoSQL injection
app.use(xss()); // Against XSS attacks

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'agrivalah'
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/sellers', sellerRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/upload', uploadRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    logger.info(`API Documentation available at http://localhost:${PORT}/docs`);
  });
};

startServer().catch(err => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;