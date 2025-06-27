// Borouge ESG Intelligence Platform - Main API Entry Point
// Vercel Serverless Function

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// ./esg-intelligence
// ./health
// Import API routes
// const esgIntelligenceRouter = require('backend/esg-intelligence');
// const healthRouter = require('backend/health');

const esgIntelligenceRouter = require('./backend/esg-intelligence');
const healthRouter = require('./backend/health');

const app = express();
// const app = require('./app');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://dqvhivaguuyzlmxfvgrm.supabase.co", "https://generativelanguage.googleapis.com", "https://newsapi.ai"]
    }
  }
}));

// CORS configuration
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://borouge-esg-intelligence.vercel.app', 'https://borougeclient1.vercel.app']
//     : ['http://localhost:3000', 'http://localhost:3001'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// }));
// app.use(cors({
//   origin: function (origin, callback) {
//     const allowedOrigins = [
//       'https://testing-repo-hil6.vercel.app', // your frontend
//       'http://localhost:3000'                // local dev
//     ];

//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS not allowed from this origin: ' + origin));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
app.use(cors({
  origin: 'https://borougeesginsights.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// app.use(cors({
//   origin: '*', // Accept any frontend origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/esg-intelligence', esgIntelligenceRouter);

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Borouge ESG Intelligence Platform API',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      health: '/api/health',
      esgIntelligence: '/api/esg-intelligence',
      documentation: 'https://github.com/Mitty530/borouge-esg-intelligence'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
      timestamp: new Date().toISOString(),
      ...(isDevelopment && { stack: err.stack })
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'API endpoint not found',
      status: 404,
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  });
});

// Export for Vercel
// module.exports = app;
module.exports = (req, res) => {
  return app(req, res);
};