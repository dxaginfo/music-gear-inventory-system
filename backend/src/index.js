/**
 * Music Gear Inventory System
 * Main application entry point
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const equipmentRoutes = require('./routes/equipment.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const eventRoutes = require('./routes/event.routes');
const reportRoutes = require('./routes/report.routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma client
const prisma = new PrismaClient();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS configuration
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser
app.use(morgan('dev')); // HTTP request logger

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reports', reportRoutes);

// API documentation
if (process.env.NODE_ENV !== 'production') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('../swagger.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Error handling middleware
app.use(errorHandler);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Graceful shutdown
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Graceful shutdown
  process.exit(1);
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app; // Export for testing purposes