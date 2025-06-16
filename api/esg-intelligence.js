// Borouge ESG Intelligence API Endpoint
const express = require('express');
const NewsService = require('./services/news-service');
const GeminiService = require('./services/gemini-service');
const SupabaseService = require('./services/supabase-service');

const router = express.Router();

// Initialize services
const newsService = new NewsService();
const geminiService = new GeminiService();
const supabaseService = new SupabaseService();

/**
 * Main ESG Intelligence Analysis Endpoint
 * POST /api/esg-intelligence/analyze
 */
router.post('/analyze', async (req, res) => {
  const startTime = Date.now();
  let sessionId = null;

  try {
    const { query, userId } = req.body;

    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query is required and must be a non-empty string',
        timestamp: new Date().toISOString()
      });
    }

    // Validate ESG query relevance
    const queryValidation = geminiService.validateESGQuery(query);
    if (!queryValidation.isValid) {
      return res.status(400).json({
        error: 'Query does not appear to be ESG-related',
        suggestions: queryValidation.suggestions,
        timestamp: new Date().toISOString()
      });
    }

    // Get or create user
    const user = userId ? { id: userId } : await supabaseService.getOrCreateDefaultUser();

    // Check API rate limits
    const geminiStats = geminiService.getUsageStats();
    const newsStats = newsService.getUsageStats();

    if (geminiStats.remainingRequests <= 0) {
      return res.status(429).json({
        error: 'Daily Gemini API limit reached. Please try again tomorrow.',
        retryAfter: '24 hours',
        timestamp: new Date().toISOString()
      });
    }

    if (newsStats.remainingRequests <= 0) {
      return res.status(429).json({
        error: 'Daily NewsAPI limit reached. Please try again tomorrow.',
        retryAfter: '24 hours',
        timestamp: new Date().toISOString()
      });
    }

    console.log('Starting ESG intelligence analysis for query:', query);

    // 1. Create research session
    const session = await supabaseService.createResearchSession(user.id, query);
    sessionId = session.id;

    // 2. Search for news articles
    console.log('Searching for news articles...');
    const newsResults = await newsService.searchNews(query, { limit: 20 });
    const articles = newsResults.articles;

    console.log(`Found ${articles.length} relevant articles`);

    // Check if we have enough articles for analysis
    if (articles.length < 3) {
      await supabaseService.markSessionAsFailed(sessionId, 'Insufficient relevant articles found');
      return res.status(404).json({
        error: 'Insufficient relevant articles found for analysis',
        message: 'Please try a more specific ESG-related query',
        articlesFound: articles.length,
        minimumRequired: 3,
        suggestions: [
          'carbon emissions petrochemical industry',
          'ESG regulations chemical companies',
          'sustainability initiatives polymer industry'
        ],
        timestamp: new Date().toISOString()
      });
    }

    // 3. Store articles in database
    await supabaseService.storeNewsArticles(sessionId, articles);

    // 4. Generate ESG intelligence using Gemini
    console.log('Generating ESG intelligence analysis...');
    const intelligence = await geminiService.generateESGIntelligence(articles, query);

    // 5. Store analysis results
    await supabaseService.storeLLMAnalysis(sessionId, intelligence);

    // 6. Complete session
    const processingTime = Date.now() - startTime;
    await supabaseService.completeResearchSession(
      sessionId,
      articles.length,
      intelligence.confidence,
      processingTime
    );

    // 7. Track API usage
    await supabaseService.trackAPIUsage('esg-intelligence', '/analyze', user.id, sessionId);

    // 8. Return comprehensive results
    const response = {
      sessionId: sessionId,
      originalQuery: query,
      intelligence: {
        executiveSummary: intelligence.structuredAnalysis?.executiveSummary,
        criticalFindings: intelligence.structuredAnalysis?.criticalFindings || [],
        financialImpact: intelligence.structuredAnalysis?.financialImpact || {},
        strategicRecommendations: intelligence.structuredAnalysis?.strategicRecommendations || [],
        competitiveBenchmarking: intelligence.structuredAnalysis?.competitiveBenchmarking,
        riskOpportunityMatrix: intelligence.structuredAnalysis?.riskOpportunityMatrix,
        monitoringRequirements: intelligence.structuredAnalysis?.monitoringRequirements
      },
      queryType: intelligence.queryType,
      confidence: intelligence.confidence,
      totalSources: articles.length,
      topSources: intelligence.topSources,
      borogueContext: intelligence.borogueContext,
      processingTime: processingTime,
      apiUsage: {
        gemini: geminiService.getUsageStats(),
        newsapi: newsService.getUsageStats()
      },
      timestamp: new Date().toISOString()
    };

    console.log('ESG intelligence analysis completed successfully');
    res.json(response);

  } catch (error) {
    console.error('ESG intelligence analysis error:', error);

    // Mark session as failed if it was created
    if (sessionId) {
      await supabaseService.markSessionAsFailed(sessionId, error.message);
    }

    // Determine error type and status code
    let statusCode = 500;
    let errorMessage = 'Internal server error during ESG analysis';

    if (error.message.includes('API limit')) {
      statusCode = 429;
      errorMessage = error.message;
    } else if (error.message.includes('NewsAPI') || error.message.includes('search failed')) {
      statusCode = 503;
      errorMessage = 'News search service temporarily unavailable';
    } else if (error.message.includes('Gemini') || error.message.includes('intelligence generation')) {
      statusCode = 503;
      errorMessage = 'AI analysis service temporarily unavailable';
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      sessionId: sessionId,
      processingTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get Research History
 * GET /api/esg-intelligence/history/:userId
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    const history = await supabaseService.getResearchHistory(userId, limit);

    res.json({
      history: history,
      count: history.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching research history:', error);
    res.status(500).json({
      error: 'Failed to fetch research history',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get Session Details
 * GET /api/esg-intelligence/session/:sessionId
 */
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sessionDetails = await supabaseService.getSessionDetails(sessionId);

    res.json({
      ...sessionDetails,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching session details:', error);
    res.status(500).json({
      error: 'Failed to fetch session details',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Submit User Feedback
 * POST /api/esg-intelligence/feedback
 */
router.post('/feedback', async (req, res) => {
  try {
    const { sessionId, originalQuery, enhancedQuery, rating, feedback } = req.body;

    await supabaseService.storeUserFeedback(originalQuery, enhancedQuery, rating, feedback);

    res.json({
      message: 'Feedback submitted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      error: 'Failed to submit feedback',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get API Status
 * GET /api/esg-intelligence/status
 */
router.get('/status', async (req, res) => {
  try {
    const status = {
      services: {
        gemini: geminiService.getUsageStats(),
        newsapi: newsService.getUsageStats(),
        database: await supabaseService.getHealthStatus()
      },
      timestamp: new Date().toISOString()
    };

    res.json(status);

  } catch (error) {
    console.error('Error getting API status:', error);
    res.status(500).json({
      error: 'Failed to get API status',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
