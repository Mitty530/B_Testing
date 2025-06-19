module.exports = (req, res) => {
  res.status(200).json({
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
};