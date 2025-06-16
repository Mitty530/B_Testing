// NewsAPI.ai Service for Borouge ESG Intelligence
const axios = require('axios');

class NewsService {
  constructor() {
    this.apiKey = process.env.NEWSAPI_AI_KEY;
    this.baseUrl = 'https://newsapi.ai/api/v1';
    this.dailyRequestCount = 0;
    this.maxDailyRequests = 100; // Free tier limit
  }

  /**
   * Search for news articles using NewsAPI.ai
   */
  async searchNews(query, options = {}) {
    try {
      if (this.dailyRequestCount >= this.maxDailyRequests) {
        throw new Error('Daily NewsAPI.ai request limit reached');
      }

      // Enhance query with Borouge-specific context
      const enhancedQuery = this.enhanceQueryForBorouge(query);
      
      const searchParams = {
        apiKey: this.apiKey,
        query: enhancedQuery,
        articlesCount: options.limit || 20,
        articlesSortBy: 'rel',
        includeArticleBody: true,
        includeArticleImage: true,
        articleBodyLen: 500,
        lang: 'eng'
      };

      console.log('NewsAPI.ai search params:', searchParams);

      const response = await axios.get(`${this.baseUrl}/article/getArticles`, {
        params: searchParams,
        timeout: 15000
      });

      this.dailyRequestCount++;

      if (response.data && response.data.articles) {
        const processedArticles = this.processArticlesForBorouge(
          response.data.articles.results || response.data.articles,
          query
        );
        
        return {
          articles: processedArticles,
          totalResults: response.data.totalResults || processedArticles.length,
          requestsRemaining: this.maxDailyRequests - this.dailyRequestCount
        };
      }

      return {
        articles: [],
        totalResults: 0,
        requestsRemaining: this.maxDailyRequests - this.dailyRequestCount
      };

    } catch (error) {
      console.error('NewsAPI.ai search error:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      
      throw new Error(`NewsAPI.ai search failed: ${error.message}`);
    }
  }

  /**
   * Enhance query with Borouge-specific terms
   */
  enhanceQueryForBorouge(originalQuery) {
    const borogueTerms = [
      'petrochemical',
      'chemical industry',
      'polymer',
      'polyethylene',
      'polypropylene',
      'ESG',
      'sustainability'
    ];

    // Add relevant Borouge terms to the query
    const enhancedTerms = [];
    
    // Always include core business terms
    enhancedTerms.push('(petrochemical OR "chemical industry" OR polymer)');
    
    // Add original query
    enhancedTerms.push(originalQuery);
    
    // Add ESG context if not already present
    if (!originalQuery.toLowerCase().includes('esg') && 
        !originalQuery.toLowerCase().includes('sustainability')) {
      enhancedTerms.push('(ESG OR sustainability OR "environmental impact")');
    }

    return enhancedTerms.join(' AND ');
  }

  /**
   * Process articles with Borouge-specific relevance scoring
   */
  processArticlesForBorouge(articles, originalQuery) {
    if (!Array.isArray(articles)) {
      console.warn('Articles is not an array:', articles);
      return [];
    }

    return articles
      .map(article => this.scoreArticleRelevance(article, originalQuery))
      .filter(article => article.relevanceScore > 0.2) // Filter low relevance
      .sort((a, b) => b.totalScore - a.totalScore) // Sort by total score
      .slice(0, 15); // Limit to top 15 articles
  }

  /**
   * Score article relevance for Borouge
   */
  scoreArticleRelevance(article, originalQuery) {
    const text = `${article.title || ''} ${article.body || article.description || ''}`.toLowerCase();
    
    let relevanceScore = 0;
    let credibilityScore = 0;
    let borogueImpact = 0;

    // Borouge-specific terms (high weight)
    const borogueTerms = ['borouge', 'petrochemical', 'polyethylene', 'polypropylene', 'polymer'];
    borogueTerms.forEach(term => {
      if (text.includes(term)) relevanceScore += 0.3;
    });

    // Market/geographic relevance
    const marketTerms = ['uae', 'singapore', 'europe', 'asia', 'middle east', 'gulf'];
    marketTerms.forEach(term => {
      if (text.includes(term)) relevanceScore += 0.2;
    });

    // Competitor mentions (strategic intelligence)
    const competitorTerms = ['sabic', 'dow chemical', 'exxonmobil chemical', 'equate', 'qapco'];
    competitorTerms.forEach(term => {
      if (text.includes(term)) relevanceScore += 0.25;
    });

    // ESG and regulatory terms
    const esgTerms = ['esg', 'sustainability', 'regulation', 'carbon', 'circular economy', 'environmental'];
    esgTerms.forEach(term => {
      if (text.includes(term)) relevanceScore += 0.15;
    });

    // Original query terms
    const queryTerms = originalQuery.toLowerCase().split(' ');
    queryTerms.forEach(term => {
      if (term.length > 2 && text.includes(term)) relevanceScore += 0.1;
    });

    // Assess Borouge impact
    if (text.includes('regulation') || text.includes('policy') || text.includes('carbon tax')) {
      borogueImpact = 0.8;
    } else if (text.includes('market') || text.includes('price') || text.includes('competitor')) {
      borogueImpact = 0.6;
    } else if (text.includes('industry') || text.includes('technology')) {
      borogueImpact = 0.4;
    } else {
      borogueImpact = 0.2;
    }

    // Calculate credibility score
    credibilityScore = this.calculateCredibilityScore(article);

    // Calculate total score
    const totalScore = relevanceScore + credibilityScore + borogueImpact;

    return {
      title: article.title || 'No title',
      description: article.body || article.description || 'No description',
      url: article.url || '#',
      source: article.source?.title || article.source?.name || 'Unknown source',
      publishedAt: article.dateTime || article.publishedAt || new Date().toISOString(),
      content: article.body || article.description || '',
      imageUrl: article.image || null,
      relevanceScore: Math.min(relevanceScore, 1.0),
      credibilityScore: credibilityScore,
      borogueImpact: borogueImpact,
      totalScore: totalScore,
      sourceApi: 'newsapi.ai'
    };
  }

  /**
   * Calculate source credibility score
   */
  calculateCredibilityScore(article) {
    const trustedSources = [
      'reuters', 'bloomberg', 'financial times', 'wall street journal',
      'chemical week', 'icis', 'plastics news', 'oil gas journal',
      'chemical engineering', 'process worldwide', 'hydrocarbon processing'
    ];
    
    const sourceName = (article.source?.title || article.source?.name || '').toLowerCase();
    const isTrusted = trustedSources.some(trusted => sourceName.includes(trusted));
    
    return isTrusted ? 0.9 : 0.5;
  }

  /**
   * Get API usage statistics
   */
  getUsageStats() {
    return {
      dailyRequestCount: this.dailyRequestCount,
      maxDailyRequests: this.maxDailyRequests,
      remainingRequests: this.maxDailyRequests - this.dailyRequestCount,
      resetTime: 'Daily at 00:00 UTC'
    };
  }

  /**
   * Reset daily counter (called by scheduler)
   */
  resetDailyCounter() {
    this.dailyRequestCount = 0;
  }
}

module.exports = NewsService;
