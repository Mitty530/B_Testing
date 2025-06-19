// ESG Intelligence API endpoint
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle different routes based on the path
  const path = req.url.split('/api/esg-intelligence/')[1] || '';
  
  // Handle analyze endpoint
  if (path === 'analyze' && req.method === 'POST') {
    try {
      // Parse request body
      let body;
      try {
        body = JSON.parse(req.body);
      } catch (e) {
        // If req.body is already an object, use it directly
        body = typeof req.body === 'object' ? req.body : {};
      }
      
      const query = body.query;
      
      if (!query) {
        return res.status(400).json({
          error: 'Query is required',
          timestamp: new Date().toISOString()
        });
      }
      
      // Mock response for now
      return res.status(200).json({
        sessionId: 'mock-session-' + Date.now(),
        query: query,
        summary: 'This is a mock ESG intelligence analysis.',
        keyFindings: [
          'Mock finding 1', 
          'Mock finding 2',
          'Mock finding 3'
        ],
        recommendations: [
          'Mock recommendation 1',
          'Mock recommendation 2'
        ],
        confidence: 0.85,
        totalSources: 5,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in analyze endpoint:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Handle status endpoint
  if (path === 'status' || path === '') {
    return res.status(200).json({
      status: 'operational',
      services: {
        gemini: {
          status: 'operational',
          remainingRequests: 100
        },
        newsapi: {
          status: 'operational',
          remainingRequests: 50
        },
        database: {
          status: 'operational'
        }
      },
      timestamp: new Date().toISOString()
    });
  }
  
  // Handle unknown endpoints
  return res.status(404).json({
    error: 'Endpoint not found',
    path: `/api/esg-intelligence/${path}`,
    timestamp: new Date().toISOString()
  });
};
