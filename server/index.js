// Force environment variables first (before any imports)
process.env.SHOPIFY_SHOP_NAME = 'xenoxify.myshopify.com';
process.env.SHOPIFY_ACCESS_TOKEN = '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';
process.env.JWT_SECRET = 'xenoxify_jwt_secret_2024_development_key';
process.env.SHOPIFY_API_KEY = 'd9ade4d748633196f00b1133f36aaa19';
process.env.NODE_ENV = 'development';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.DATABASE_URL = 'file:./dev.db';

require('dotenv').config();

// Debug: Check if env vars are loaded
console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SHOPIFY_SHOP_NAME:', process.env.SHOPIFY_SHOP_NAME);
console.log('SHOPIFY_ACCESS_TOKEN:', process.env.SHOPIFY_ACCESS_TOKEN ? 'EXISTS' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'EXISTS' : 'MISSING');
console.log('Current working directory:', process.cwd());
console.log('================================');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { PrismaClient } = require('@prisma/client');

// Import routes
const authRoutes = require('./routes/auth');
const webhookRoutes = require('./routes/webhooks');
const apiRoutes = require('./routes/api');
const tenantRoutes = require('./routes/tenants');
const shopifyRoutes = require('./routes/shopify');

const app = express();
const prisma = new PrismaClient();

// 🔧 FIX: Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting - Updated configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api', apiRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/shopify', shopifyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Xenoxify server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;