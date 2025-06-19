// Health check endpoint for Vercel deployment
module.exports = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Borouge ESG Intelligence API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};