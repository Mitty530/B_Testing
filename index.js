const express = require('express');
const cors = require('cors');
const app = express();

// Allow only your Netlify frontend domain
app.use(cors({
  origin: 'https://borouge-esg-intelligence.netlify.app'
}));

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

app.post('/api/esg-intelligence/analyze', (req, res) => {
  // You can process req.body here
  res.json({
    message: 'Analysis received!',
    query: req.body.query,
    userId: req.body.userId,
    result: 'This is a mock analysis result.' // Replace with your real logic
  });
});

// (Optional) Add your other endpoints here, e.g. /api/health, /api/esg-intelligence

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});