// Health Check API Endpoint
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

const router = express.Router();

// Initialize services
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check endpoint
router.get('/', async (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {}
  };

  try {
    // Check Supabase connection
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      healthCheck.services.supabase = {
        status: error ? 'unhealthy' : 'healthy',
        message: error ? error.message : 'Connected successfully',
        responseTime: Date.now()
      };
    } catch (supabaseError) {
      healthCheck.services.supabase = {
        status: 'unhealthy',
        message: supabaseError.message,
        responseTime: Date.now()
      };
    }

    // Check Gemini AI connection
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Test connection");
      
      healthCheck.services.gemini = {
        status: 'healthy',
        message: 'Connected successfully',
        responseTime: Date.now()
      };
    } catch (geminiError) {
      healthCheck.services.gemini = {
        status: 'unhealthy',
        message: geminiError.message,
        responseTime: Date.now()
      };
    }

    // Check NewsAPI.ai connection
    try {
      const response = await axios.get('https://newsapi.ai/api/v1/article/getArticles', {
        params: {
          apiKey: process.env.NEWSAPI_AI_KEY,
          query: 'test',
          articlesCount: 1
        },
        timeout: 5000
      });
      
      healthCheck.services.newsapi = {
        status: response.status === 200 ? 'healthy' : 'unhealthy',
        message: response.status === 200 ? 'Connected successfully' : 'Connection failed',
        responseTime: Date.now()
      };
    } catch (newsApiError) {
      healthCheck.services.newsapi = {
        status: 'unhealthy',
        message: newsApiError.message,
        responseTime: Date.now()
      };
    }

    // Determine overall health
    const unhealthyServices = Object.values(healthCheck.services)
      .filter(service => service.status === 'unhealthy');
    
    if (unhealthyServices.length > 0) {
      healthCheck.status = 'degraded';
      res.status(503);
    }

    res.json(healthCheck);

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Detailed system info endpoint
router.get('/system', (req, res) => {
  res.json({
    platform: process.platform,
    nodeVersion: process.version,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasNewsApiKey: !!process.env.NEWSAPI_AI_KEY
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
