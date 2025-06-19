// GNews.io Service for Borouge ESG Intelligence
const axios = require('axios');

class NewsService {
  constructor() {
    this.apiKey = process.env.GNEWS_API_KEY || 'c39602764051b36252013d0cdc8127d5';
    this.baseUrl = 'https://gnews.io/api/v4';
    this.dailyRequestCount = 0;
    this.maxDailyRequests = 100; // GNews.io free tier limit
    this.maxArticlesPerRequest = 100; // Maximum articles per request
    this.optimalArticlesPerRequest = 50; // Optimal balance of quality vs quantity
  }

  /**
   * Search for real news articles using GNews.io
   */
  async searchNews(query, options = {}) {
    try {
      if (this.dailyRequestCount >= this.maxDailyRequests) {
        throw new Error('Daily GNews.io request limit reached');
      }

      console.log('🔍 Searching GNews.io for REAL news articles...');
      console.log('Query:', query);

      // Try multiple query strategies
      const queryStrategies = this.buildQueryStrategies(query);

      for (let i = 0; i < queryStrategies.length; i++) {
        const currentQuery = queryStrategies[i];
        console.log(`Trying query strategy ${i + 1}/${queryStrategies.length}:`, currentQuery);

        const searchParams = {
          q: currentQuery,
          token: this.apiKey,
          lang: 'en',
          country: 'us,gb,ae,sg', // US, UK, UAE, Singapore for global coverage
          max: options.limit || this.optimalArticlesPerRequest,
          sortby: 'relevance',
          from: this.getOptimalDateRange(), // Get articles from last 30 days for relevance
          to: new Date().toISOString().split('T')[0] // Today
        };

        console.log('GNews.io search params:', { ...searchParams, token: '[HIDDEN]' });

        const response = await axios.get(`${this.baseUrl}/search`, {
          params: searchParams,
          timeout: 15000
        });

        this.dailyRequestCount++;
        console.log('✅ GNews.io response received:', response.status);

        if (response.data && response.data.articles) {
          const articles = response.data.articles;
          console.log(`📰 Found ${articles.length} raw articles from GNews.io`);

          const processedArticles = this.processArticlesForBorouge(articles, query);
          console.log(`🎯 Processed to ${processedArticles.length} relevant articles`);

          // If we found enough articles, return them
          if (processedArticles.length >= 2) {
            return {
              articles: processedArticles,
              totalResults: response.data.totalArticles || processedArticles.length,
              requestsRemaining: this.maxDailyRequests - this.dailyRequestCount,
              source: 'gnews.io-live',
              queryUsed: currentQuery
            };
          }

          // If this is the last strategy and we have some articles, return them anyway
          if (i === queryStrategies.length - 1 && processedArticles.length > 0) {
            return {
              articles: processedArticles,
              totalResults: response.data.totalArticles || processedArticles.length,
              requestsRemaining: this.maxDailyRequests - this.dailyRequestCount,
              source: 'gnews.io-live',
              queryUsed: currentQuery
            };
          }
        }
      }

      console.log('⚠️ No articles found in GNews.io response');
      return {
        articles: [],
        totalResults: 0,
        requestsRemaining: this.maxDailyRequests - this.dailyRequestCount,
        source: 'gnews.io-live'
      };

    } catch (error) {
      console.error('❌ GNews.io search error:', error.message);

      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }

      // Don't fallback to mock data - user wants real news only
      throw new Error(`GNews.io search failed: ${error.message}`);
    }
  }

  /**
   * Build multiple query strategies for better results
   */
  buildQueryStrategies(originalQuery) {
    const queryLower = originalQuery.toLowerCase();
    const wordCount = originalQuery.trim().split(/\s+/).length;
    const strategies = [];

    // Strategy 1: Use original query as-is
    strategies.push(originalQuery);

    // Strategy 2: Enhanced query (only if original is short)
    if (wordCount <= 3) {
      const enhancedQuery = this.buildESGQuery(originalQuery);
      if (enhancedQuery !== originalQuery) {
        strategies.push(enhancedQuery);
      }
    }

    // Strategy 3: Extract key terms for broader search
    if (wordCount > 2) {
      const keyTerms = this.extractKeyTerms(originalQuery);
      if (keyTerms !== originalQuery) {
        strategies.push(keyTerms);
      }
    }

    // Strategy 4: Fallback to general ESG terms
    if (!queryLower.includes('sustainability') && !queryLower.includes('esg')) {
      strategies.push('sustainability petrochemical');
    }

    // Strategy 5: Ultimate fallback - just "sustainability"
    if (!strategies.includes('sustainability')) {
      strategies.push('sustainability');
    }

    // Strategy 6: Last resort - "ESG"
    if (!strategies.includes('ESG') && !strategies.includes('esg')) {
      strategies.push('ESG');
    }

    return strategies;
  }

  /**
   * Extract key terms from complex queries
   */
  extractKeyTerms(query) {
    const importantWords = ['carbon', 'emissions', 'sustainability', 'ESG', 'regulation', 'petrochemical', 'chemical', 'polymer', 'environment', 'compliance'];
    const words = query.toLowerCase().split(/\s+/);
    const keyWords = words.filter(word =>
      importantWords.includes(word) ||
      word.length > 6 // Include longer words that might be important
    );

    return keyWords.slice(0, 3).join(' ') || query; // Max 3 key words
  }

  /**
   * Build ESG-focused query for GNews.io (legacy method)
   */
  buildESGQuery(originalQuery) {
    // For GNews.io, use simple keyword format (no complex AND/OR operators)
    const queryLower = originalQuery.toLowerCase();

    // If the query is already very specific (more than 4 words), use it as-is
    const wordCount = originalQuery.trim().split(/\s+/).length;
    if (wordCount >= 4) {
      return originalQuery;
    }

    // Start with the original query
    let enhancedQuery = originalQuery;

    // Only add industry context if query is very general (1-2 words)
    if (wordCount <= 2 &&
        !queryLower.includes('petrochemical') &&
        !queryLower.includes('chemical') &&
        !queryLower.includes('polymer')) {
      enhancedQuery += ' petrochemical';
    }

    return enhancedQuery;
  }

  /**
   * Build keyword query for NewsAPI.ai (legacy method)
   */
  buildKeywordQuery(originalQuery) {
    // Use simple keyword format for NewsAPI.ai
    const keywords = [];

    // Add original query terms
    keywords.push(originalQuery);

    // Add industry context
    keywords.push('petrochemical OR chemical OR polymer');

    // Add ESG context if not already present
    if (!originalQuery.toLowerCase().includes('esg') &&
        !originalQuery.toLowerCase().includes('sustainability')) {
      keywords.push('ESG OR sustainability');
    }

    return keywords.join(' ');
  }

  /**
   * Enhance query with Borouge-specific terms (legacy method)
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
      description: article.content || article.body || article.description || 'No description',
      url: article.url || '#',
      source: article.source?.name || article.source?.title || 'Unknown source',
      publishedAt: article.publishedAt || article.dateTime || new Date().toISOString(),
      content: article.content || article.body || article.description || '',
      imageUrl: article.image || article.urlToImage || null,
      relevanceScore: Math.min(relevanceScore, 1.0),
      credibilityScore: credibilityScore,
      borogueImpact: borogueImpact,
      totalScore: totalScore,
      sourceApi: 'gnews.io'
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
   * Get optimal date range for news articles (last 30 days)
   */
  getOptimalDateRange() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return thirtyDaysAgo.toISOString().split('T')[0];
  }

  /**
   * Get enhanced API usage statistics
   */
  getUsageStats() {
    return {
      dailyRequestCount: this.dailyRequestCount,
      maxDailyRequests: this.maxDailyRequests,
      remainingRequests: this.maxDailyRequests - this.dailyRequestCount,
      utilizationPercentage: Math.round((this.dailyRequestCount / this.maxDailyRequests) * 100),
      maxArticlesPerRequest: this.maxArticlesPerRequest,
      optimalArticlesPerRequest: this.optimalArticlesPerRequest,
      resetTime: 'Daily at 00:00 UTC',
      tier: 'GNews.io Free Tier'
    };
  }

  /**
   * Check if we can make more requests today
   */
  canMakeRequest() {
    return this.dailyRequestCount < this.maxDailyRequests;
  }

  /**
   * Get remaining request capacity
   */
  getRemainingCapacity() {
    return Math.max(0, this.maxDailyRequests - this.dailyRequestCount);
  }

  /**
   * Get mock news data for testing
   */
  getMockNewsData(query, options = {}) {
    const mockArticles = [
      {
        title: "New Carbon Emissions Regulations Impact Petrochemical Industry",
        body: "The European Union has announced new carbon emissions regulations that will significantly impact the petrochemical industry. Companies like Borouge and other major players will need to adapt their operations to meet stricter environmental standards. The regulations focus on reducing carbon footprint and promoting sustainable practices in polymer production.",
        url: "https://example.com/carbon-regulations",
        source: { title: "Chemical Industry News" },
        dateTime: new Date().toISOString(),
        image: "https://example.com/image1.jpg"
      },
      {
        title: "Sustainability Initiatives Drive Innovation in Polymer Manufacturing",
        body: "Leading petrochemical companies are investing heavily in sustainability initiatives to reduce their environmental impact. The focus on circular economy principles and recycling technologies is reshaping the industry. ESG considerations are becoming central to business strategy and operational decisions.",
        url: "https://example.com/sustainability-innovation",
        source: { title: "Polymer Weekly" },
        dateTime: new Date(Date.now() - 86400000).toISOString(),
        image: "https://example.com/image2.jpg"
      },
      {
        title: "Middle East Petrochemical Market Outlook: ESG and Growth",
        body: "The Middle East petrochemical market is experiencing significant growth while adapting to ESG requirements. Companies in the UAE and Saudi Arabia are implementing new technologies to reduce environmental impact while maintaining competitive advantage. Market analysts predict continued expansion with sustainability focus.",
        url: "https://example.com/middle-east-outlook",
        source: { title: "Energy Intelligence" },
        dateTime: new Date(Date.now() - 172800000).toISOString(),
        image: "https://example.com/image3.jpg"
      },
      {
        title: "Circular Economy Policies Reshape Chemical Industry Strategy",
        body: "New circular economy policies are forcing chemical companies to rethink their business models. The emphasis on recycling, waste reduction, and sustainable production methods is creating both challenges and opportunities. Industry leaders are investing in new technologies to comply with regulations.",
        url: "https://example.com/circular-economy",
        source: { title: "Chemical Engineering Today" },
        dateTime: new Date(Date.now() - 259200000).toISOString(),
        image: "https://example.com/image4.jpg"
      },
      {
        title: "ESG Reporting Standards for Chemical Companies Updated",
        body: "Updated ESG reporting standards require chemical companies to provide more detailed environmental and social impact data. The new standards focus on transparency, accountability, and measurable sustainability goals. Companies must adapt their reporting processes to meet these requirements.",
        url: "https://example.com/esg-reporting",
        source: { title: "Sustainability Report" },
        dateTime: new Date(Date.now() - 345600000).toISOString(),
        image: "https://example.com/image5.jpg"
      }
    ];

    const processedArticles = this.processArticlesForBorouge(mockArticles, query);

    return {
      articles: processedArticles.slice(0, options.limit || 20),
      totalResults: processedArticles.length,
      requestsRemaining: this.maxDailyRequests - this.dailyRequestCount
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
