// Borouge ESG Intelligence API Endpoint
const express = require('express');
const NewsService = require('./services/news-service');
const EnterpriseNewsOrchestrator = require('./services/enterprise-news-orchestrator');
const GeminiService = require('./services/gemini-service');
const SupabaseService = require('./services/supabase-service');

const router = express.Router();

// Initialize services
const newsService = new NewsService();
const enterpriseNewsOrchestrator = new EnterpriseNewsOrchestrator();
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

    // 1. Create research session (skip if Supabase unavailable)
    try {
      const session = await supabaseService.createResearchSession(user.id, query);
      sessionId = session.id;
    } catch (error) {
      console.log('Supabase unavailable, proceeding without session tracking');
      sessionId = 'temp-' + Date.now();
    }

    // 2. Enterprise Multi-Source News Search
    console.log('🏢 Starting Enterprise News Search...');
    const newsResults = await enterpriseNewsOrchestrator.searchEnterpriseNews(query, {
      targetArticles: parseInt(process.env.TARGET_ARTICLES_PER_QUERY) || 18
    });
    const articles = newsResults.articles;

    console.log(`✅ Enterprise search completed: ${articles.length} high-quality articles`);
    console.log(`📊 Quality Score: ${(newsResults.qualityScore * 100).toFixed(1)}%`);
    console.log(`🎯 Enterprise Grade: ${newsResults.enterpriseGrade ? 'YES' : 'NO'}`);
    console.log(`📈 Source Diversity: ${newsResults.sourceStatistics?.uniqueSourcesUsed}/${newsResults.totalSources} sources`);
    console.log(`🔍 Raw → Final: ${newsResults.rawArticleCount} → ${newsResults.finalArticleCount} articles`);

    // Check if we have enough articles for analysis
    if (articles.length < 1) {
      try {
        await supabaseService.markSessionAsFailed(sessionId, 'Insufficient relevant articles found');
      } catch (error) {
        console.log('Supabase unavailable, skipping session failure marking');
      }
      return res.status(404).json({
        error: 'Insufficient relevant articles found for analysis',
        message: 'Please try a more specific ESG-related query',
        articlesFound: articles.length,
        minimumRequired: 1,
        suggestions: [
          'carbon emissions petrochemical industry',
          'ESG regulations chemical companies',
          'sustainability initiatives polymer industry'
        ],
        timestamp: new Date().toISOString()
      });
    }

    // 3. Store articles in database (skip if Supabase unavailable)
    try {
      await supabaseService.storeNewsArticles(sessionId, articles);
    } catch (error) {
      console.log('Supabase unavailable, skipping article storage');
    }

    // 4. Generate ESG intelligence using Gemini
    console.log('Generating ESG intelligence analysis...');
    const intelligence = await geminiService.generateESGIntelligence(articles, query);

    // 5. Store analysis results (skip if Supabase unavailable)
    try {
      await supabaseService.storeLLMAnalysis(sessionId, intelligence);
    } catch (error) {
      console.log('Supabase unavailable, skipping analysis storage');
    }

    // 6. Complete session (skip if Supabase unavailable)
    const processingTime = Date.now() - startTime;
    try {
      await supabaseService.completeResearchSession(
        sessionId,
        articles.length,
        intelligence.confidence,
        processingTime
      );
    } catch (error) {
      console.log('Supabase unavailable, skipping session completion');
    }

    // 7. Track API usage (skip if Supabase unavailable)
    try {
      await supabaseService.trackAPIUsage('esg-intelligence', '/analyze', user.id, sessionId);
    } catch (error) {
      console.log('Supabase unavailable, skipping usage tracking');
    }

    // 8. Return comprehensive results with enhanced news statistics
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
      newsResults: {
        totalSources: newsResults.totalSources,
        sourceBreakdown: newsResults.sourceBreakdown,
        sourceStatistics: newsResults.sourceStatistics,
        qualityScore: newsResults.qualityScore,
        enterpriseGrade: newsResults.enterpriseGrade,
        rawArticleCount: newsResults.rawArticleCount,
        finalArticleCount: newsResults.finalArticleCount,
        diversityScore: newsResults.diversityScore,
        processingTime: newsResults.processingTime
      },
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

    // Mark session as failed if it was created (skip if Supabase unavailable)
    if (sessionId) {
      try {
        await supabaseService.markSessionAsFailed(sessionId, error.message);
      } catch (dbError) {
        console.log('Supabase unavailable, skipping session failure marking');
      }
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
 * Test ESG Analysis (bypasses Supabase for local testing)
 * POST /api/esg-intelligence/test
 */
router.post('/test', async (req, res) => {
  const startTime = Date.now();

  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query parameter is required',
        timestamp: new Date().toISOString()
      });
    }

    console.log('Starting TEST ESG intelligence analysis for query:', query);

    // 1. Search for news articles
    console.log('Searching for news articles...');
    const newsResults = await newsService.searchNews(query, { limit: 10 });
    const articles = newsResults.articles;

    console.log(`Found ${articles.length} relevant articles from ${newsResults.source || 'unknown'}`);

    // Check if we have enough articles for analysis
    if (articles.length < 2) {
      return res.status(404).json({
        error: 'Insufficient relevant articles found for analysis',
        message: 'Please try a more specific ESG-related query',
        articlesFound: articles.length,
        minimumRequired: 2,
        dataSource: newsResults.source,
        suggestions: [
          'carbon emissions petrochemical industry',
          'ESG regulations chemical companies',
          'sustainability initiatives polymer industry'
        ],
        timestamp: new Date().toISOString()
      });
    }

    // 2. Generate ESG intelligence using Gemini
    console.log('Generating ESG intelligence analysis...');
    const intelligence = await geminiService.generateESGIntelligence(articles, query);

    // 3. Return comprehensive results
    const processingTime = Date.now() - startTime;
    const response = {
      sessionId: 'test-' + Date.now(),
      originalQuery: query,
      dataSource: newsResults.source,
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

    console.log('TEST ESG intelligence analysis completed successfully');
    res.json(response);

  } catch (error) {
    console.error('TEST ESG intelligence analysis error:', error);

    res.status(500).json({
      error: 'Internal server error during ESG analysis',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      processingTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Test Real NewsAPI.ai Integration
 * POST /api/esg-intelligence/test-real-news
 */
router.post('/test-real-news', async (req, res) => {
  const startTime = Date.now();

  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query parameter is required',
        timestamp: new Date().toISOString()
      });
    }

    console.log('Testing REAL NewsAPI.ai integration for query:', query);

    // Force real NewsAPI.ai usage by temporarily overriding the service
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production'; // Force real API usage

    try {
      const newsResults = await newsService.searchNews(query, { limit: 10 });
      const articles = newsResults.articles;

      console.log(`Real NewsAPI.ai returned ${articles.length} articles`);

      const response = {
        success: true,
        query: query,
        dataSource: newsResults.source,
        articlesFound: articles.length,
        totalResults: newsResults.totalResults,
        requestsRemaining: newsResults.requestsRemaining,
        sampleArticles: articles.slice(0, 3).map(article => ({
          title: article.title,
          source: article.source,
          publishedAt: article.publishedAt,
          relevanceScore: article.relevanceScore,
          url: article.url
        })),
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };

      res.json(response);

    } finally {
      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    }

  } catch (error) {
    console.error('Real NewsAPI.ai test error:', error);

    res.status(500).json({
      error: 'Failed to test real NewsAPI.ai integration',
      details: error.message,
      processingTime: Date.now() - startTime,
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
