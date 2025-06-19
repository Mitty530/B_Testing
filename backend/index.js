const express = require('express');
const app = express();

app.use(express.json());

// Root endpoint
app.get('/api', (req, res) => {
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
});

// (Optional) Add your other endpoints here, e.g. /api/health, /api/esg-intelligence

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});