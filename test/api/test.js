// Simple test endpoint to verify API functionality
module.exports = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};
