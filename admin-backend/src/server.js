require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const swaggerSpec = require('./config/swagger');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const topicRoutes = require('./routes/topics');
const systemInfoRoutes = require('./routes/systemInfo');
const loginTrackerRoutes = require('./routes/loginTracker');
const promptRoutes = require('./routes/prompts');
const chatEngineRoutes = require('./routes/chatEngines');
const publicTopicRoutes = require('./routes/publicTopics');


// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// CORS Middleware - allow all origins in development
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TechLifeCorp Admin API'
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/system-info', systemInfoRoutes);
app.use('/api/login-tracker', loginTrackerRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/chat-engines', chatEngineRoutes);
app.use('/api/public', publicTopicRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'TechLifeCorp Admin API'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TechLifeCorp Admin API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║       TechLifeCorp Admin API Server                ║
╠════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}          ║
║  API Docs:          http://localhost:${PORT}/api-docs ║
║  Environment:       ${process.env.NODE_ENV || 'development'}                    ║
╚════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
