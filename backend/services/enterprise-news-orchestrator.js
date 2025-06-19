// Enterprise News Orchestrator for Borouge ESG Intelligence
// Multi-source news aggregation with intelligent prioritization
const axios = require('axios');

class EnterpriseNewsOrchestrator {
  constructor() {
    // Enterprise API Configuration
    this.apiKeys = {
      gnews: process.env.GNEWS_API_KEY,
      newsapi: process.env.NEWSAPI_ORG_KEY,
      newsdata: process.env.NEWSDATA_IO_KEY,
      guardian: process.env.GUARDIAN_API_KEY,
      nyt: process.env.NYT_API_KEY
    };

    // Enterprise Performance Targets
    this.targetArticles = parseInt(process.env.TARGET_ARTICLES_PER_QUERY) || 18;
    this.maxArticles = parseInt(process.env.MAX_ARTICLES_PER_QUERY) || 25;
    
    // Source Priority Matrix (Enterprise-grade sources prioritized)
    this.sourcePriority = {
      'guardian': { weight: 0.95, esgFocus: 0.98, credibility: 0.95 },
      'nyt': { weight: 0.92, esgFocus: 0.85, credibility: 0.95 },
      'newsapi': { weight: 0.88, esgFocus: 0.75, credibility: 0.85 },
      'gnews': { weight: 0.82, esgFocus: 0.78, credibility: 0.80 },
      'newsdata': { weight: 0.78, esgFocus: 0.82, credibility: 0.75 }
    };

    // Rate Limit Management
    this.rateLimits = {
      gnews: { daily: 100, used: 0 },
      newsapi: { daily: 100, used: 0 },
      newsdata: { daily: 200, used: 0 },
      guardian: { daily: 1000, used: 0 },
      nyt: { daily: 1000, used: 0 }
    };

    // Enterprise ESG Keywords for Enhanced Relevance
    this.esgKeywords = [
      'sustainability', 'ESG', 'carbon', 'emissions', 'climate', 'environmental',
      'governance', 'compliance', 'regulation', 'circular economy', 'renewable',
      'petrochemical', 'chemical industry', 'polymer', 'polyethylene', 'CBAM',
      'carbon border', 'net zero', 'decarbonization', 'green transition'
    ];
  }

  /**
   * Enterprise-grade multi-source news search
   */
  async searchEnterpriseNews(query, options = {}) {
    console.log('🏢 Starting Enterprise News Orchestration...');
    console.log(`Target: ${this.targetArticles} articles from ${Object.keys(this.apiKeys).length} sources`);

    const startTime = Date.now();
    const allArticles = [];
    const sourceResults = {};

    try {
      // Phase 1: Parallel API calls to all sources
      const searchPromises = [
        this.searchGuardian(query).catch(e => ({ source: 'guardian', error: e.message, articles: [] })),
        this.searchNYT(query).catch(e => ({ source: 'nyt', error: e.message, articles: [] })),
        this.searchNewsAPI(query).catch(e => ({ source: 'newsapi', error: e.message, articles: [] })),
        this.searchGNews(query).catch(e => ({ source: 'gnews', error: e.message, articles: [] })),
        this.searchNewsData(query).catch(e => ({ source: 'newsdata', error: e.message, articles: [] }))
      ];

      const results = await Promise.all(searchPromises);
      
      // Phase 2: Process and consolidate results
      for (const result of results) {
        sourceResults[result.source] = {
          count: result.articles?.length || 0,
          error: result.error || null
        };
        
        if (result.articles && result.articles.length > 0) {
          allArticles.push(...result.articles);
        }
      }

      console.log('📊 Source Results:', sourceResults);
      console.log(`📰 Total raw articles collected: ${allArticles.length}`);

      // Phase 3: Enterprise-grade processing
      const processedArticles = this.processEnterpriseArticles(allArticles, query);
      const finalArticles = processedArticles.slice(0, this.maxArticles);

      const processingTime = Date.now() - startTime;
      console.log(`✅ Enterprise processing completed in ${processingTime}ms`);
      console.log(`🎯 Final article count: ${finalArticles.length}`);

      // Calculate source diversity statistics
      const sourceStats = this.calculateSourceStatistics(finalArticles, sourceResults);

      return {
        articles: finalArticles,
        totalSources: Object.keys(sourceResults).length,
        sourceBreakdown: sourceResults,
        sourceStatistics: sourceStats,
        processingTime,
        qualityScore: this.calculateQualityScore(finalArticles),
        enterpriseGrade: finalArticles.length >= this.targetArticles,
        rawArticleCount: allArticles.length,
        finalArticleCount: finalArticles.length,
        diversityScore: sourceStats.diversityScore
      };

    } catch (error) {
      console.error('❌ Enterprise News Orchestration failed:', error);
      throw new Error(`Enterprise news search failed: ${error.message}`);
    }
  }

  /**
   * The Guardian API - Premium ESG Coverage
   */
  async searchGuardian(query) {
    if (!this.canMakeRequest('guardian')) {
      throw new Error('Guardian API rate limit reached');
    }

    const searchParams = {
      q: `${query} AND (sustainability OR ESG OR environment OR climate)`,
      'api-key': this.apiKeys.guardian,
      'page-size': 10,
      'order-by': 'relevance',
      'section': 'business|environment|world',
      'show-fields': 'headline,body,thumbnail,short-url',
      'from-date': this.getDateRange(30) // Last 30 days
    };

    const response = await axios.get('https://content.guardianapis.com/search', {
      params: searchParams,
      timeout: 10000
    });

    this.rateLimits.guardian.used++;
    
    const articles = response.data.response.results.map(article => ({
      title: article.webTitle,
      description: article.fields?.body?.substring(0, 300) || 'No description',
      content: article.fields?.body || '',
      url: article.fields?.shortUrl || article.webUrl,
      source: 'The Guardian',
      publishedAt: article.webPublicationDate,
      imageUrl: article.fields?.thumbnail,
      sourceApi: 'guardian',
      credibilityScore: 0.95
    }));

    console.log(`📰 Guardian: ${articles.length} articles`);
    return { source: 'guardian', articles };
  }

  /**
   * New York Times API - Premium Business Coverage
   */
  async searchNYT(query) {
    if (!this.canMakeRequest('nyt')) {
      throw new Error('NYT API rate limit reached');
    }

    const searchParams = {
      q: `${query} AND (business OR environment OR regulation)`,
      'api-key': this.apiKeys.nyt,
      sort: 'relevance',
      page: 0,
      'begin_date': this.getNYTDateRange(30),
      'end_date': this.getNYTDateRange(0)
    };

    const response = await axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json', {
      params: searchParams,
      timeout: 10000
    });

    this.rateLimits.nyt.used++;

    const articles = response.data.response.docs.slice(0, 8).map(article => ({
      title: article.headline.main,
      description: article.abstract || article.lead_paragraph || 'No description',
      content: article.lead_paragraph || '',
      url: article.web_url,
      source: 'The New York Times',
      publishedAt: article.pub_date,
      imageUrl: article.multimedia?.[0]?.url ? `https://www.nytimes.com/${article.multimedia[0].url}` : null,
      sourceApi: 'nyt',
      credibilityScore: 0.92
    }));

    console.log(`📰 NYT: ${articles.length} articles`);
    return { source: 'nyt', articles };
  }

  /**
   * NewsAPI.org - Comprehensive Source Coverage
   */
  async searchNewsAPI(query) {
    if (!this.canMakeRequest('newsapi')) {
      throw new Error('NewsAPI rate limit reached');
    }

    const searchParams = {
      q: `${query} AND (petrochemical OR chemical OR sustainability OR ESG)`,
      apiKey: this.apiKeys.newsapi,
      sortBy: 'relevance',
      pageSize: 12,
      language: 'en',
      from: this.getDateRange(21) // Last 3 weeks
    };

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: searchParams,
      timeout: 10000
    });

    this.rateLimits.newsapi.used++;

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description || 'No description',
      content: article.content || article.description || '',
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      imageUrl: article.urlToImage,
      sourceApi: 'newsapi',
      credibilityScore: 0.85
    }));

    console.log(`📰 NewsAPI: ${articles.length} articles`);
    return { source: 'newsapi', articles };
  }

  /**
   * Enhanced GNews.io Integration
   */
  async searchGNews(query) {
    if (!this.canMakeRequest('gnews')) {
      throw new Error('GNews rate limit reached');
    }

    const searchParams = {
      q: `${query} sustainability OR ESG OR chemical OR petrochemical`,
      token: this.apiKeys.gnews,
      lang: 'en',
      country: 'us,gb,ae,sg',
      max: 10,
      sortby: 'relevance'
      // Removed date filters to get more results
    };

    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: searchParams,
      timeout: 10000
    });

    this.rateLimits.gnews.used++;

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description || 'No description',
      content: article.content || article.description || '',
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      imageUrl: article.image,
      sourceApi: 'gnews',
      credibilityScore: 0.80
    }));

    console.log(`📰 GNews: ${articles.length} articles`);
    return { source: 'gnews', articles };
  }

  /**
   * NewsData.io - International Coverage
   */
  async searchNewsData(query) {
    if (!this.canMakeRequest('newsdata')) {
      throw new Error('NewsData rate limit reached');
    }

    const searchParams = {
      apikey: this.apiKeys.newsdata,
      q: query,
      language: 'en',
      category: 'business,environment',
      size: 8
    };

    const response = await axios.get('https://newsdata.io/api/1/news', {
      params: searchParams,
      timeout: 10000
    });

    this.rateLimits.newsdata.used++;

    const articles = response.data.results.map(article => ({
      title: article.title,
      description: article.description || 'No description',
      content: article.content || article.description || '',
      url: article.link,
      source: article.source_id,
      publishedAt: article.pubDate,
      imageUrl: article.image_url,
      sourceApi: 'newsdata',
      credibilityScore: 0.75
    }));

    console.log(`📰 NewsData: ${articles.length} articles`);
    return { source: 'newsdata', articles };
  }

  /**
   * Enterprise-grade article processing with advanced deduplication
   */
  processEnterpriseArticles(articles, originalQuery) {
    console.log('🔄 Processing articles with enterprise algorithms...');

    // Step 1: Remove duplicates
    const deduplicatedArticles = this.advancedDeduplication(articles);
    console.log(`🔄 After deduplication: ${deduplicatedArticles.length} articles`);

    // Step 2: Enhanced relevance scoring
    const scoredArticles = deduplicatedArticles.map(article =>
      this.calculateEnterpriseRelevanceScore(article, originalQuery)
    );

    // Step 3: Filter by minimum relevance threshold (lowered for diversity)
    const relevantArticles = scoredArticles.filter(article =>
      article.totalScore > 0.25 // Lowered threshold for better source diversity
    );

    // Step 4: Sort by total score (relevance + credibility + ESG focus)
    const sortedArticles = relevantArticles.sort((a, b) => b.totalScore - a.totalScore);

    console.log(`✅ Enterprise processing: ${sortedArticles.length} high-quality articles`);
    return sortedArticles;
  }

  /**
   * Advanced deduplication using multiple algorithms
   */
  advancedDeduplication(articles) {
    const uniqueArticles = [];
    const seenUrls = new Set();
    const seenTitles = new Set();

    for (const article of articles) {
      // Skip if URL already seen
      if (seenUrls.has(article.url)) continue;

      // Check for similar titles (85% similarity threshold)
      const titleSimilar = Array.from(seenTitles).some(seenTitle =>
        this.calculateSimilarity(article.title.toLowerCase(), seenTitle.toLowerCase()) > 0.85
      );

      if (!titleSimilar) {
        uniqueArticles.push(article);
        seenUrls.add(article.url);
        seenTitles.add(article.title.toLowerCase());
      }
    }

    return uniqueArticles;
  }

  /**
   * Enhanced enterprise relevance scoring algorithm
   */
  calculateEnterpriseRelevanceScore(article, originalQuery) {
    const text = `${article.title} ${article.description} ${article.content}`.toLowerCase();

    let relevanceScore = 0;
    let esgScore = 0;
    let borogueImpactScore = 0;

    // Query term matching (weighted by importance)
    const queryTerms = originalQuery.toLowerCase().split(' ');
    queryTerms.forEach(term => {
      if (term.length > 2 && text.includes(term)) {
        relevanceScore += 0.12; // Reduced from 0.15 to be less restrictive
      }
    });

    // ESG keyword scoring (more generous)
    this.esgKeywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        esgScore += 0.08; // Reduced from 0.1 to be less restrictive
      }
    });

    // Borouge-specific impact assessment
    const borogueTerms = ['borouge', 'petrochemical', 'polyethylene', 'polypropylene', 'polymer', 'chemical industry'];
    borogueTerms.forEach(term => {
      if (text.includes(term)) borogueImpactScore += 0.15; // Reduced from 0.2
    });

    // Market/geographic relevance
    const marketTerms = ['uae', 'singapore', 'europe', 'asia', 'middle east', 'gulf', 'eu', 'cbam'];
    marketTerms.forEach(term => {
      if (text.includes(term)) relevanceScore += 0.08; // Reduced from 0.1
    });

    // Competitor intelligence
    const competitorTerms = ['sabic', 'dow chemical', 'exxonmobil', 'basf', 'shell', 'total'];
    competitorTerms.forEach(term => {
      if (text.includes(term)) borogueImpactScore += 0.12; // Reduced from 0.15
    });

    // Source credibility from priority matrix
    const sourceWeight = this.sourcePriority[article.sourceApi]?.weight || 0.5;
    const credibilityScore = article.credibilityScore || 0.5;

    // Base score for all articles to ensure diversity
    const baseScore = 0.2;

    // Calculate total enterprise score with base score
    const totalScore = baseScore + (relevanceScore * 0.25) + (esgScore * 0.2) + (borogueImpactScore * 0.2) +
                      (credibilityScore * 0.1) + (sourceWeight * 0.05);

    return {
      ...article,
      relevanceScore: Math.min(relevanceScore, 1.0),
      esgScore: Math.min(esgScore, 1.0),
      borogueImpactScore: Math.min(borogueImpactScore, 1.0),
      totalScore: Math.min(totalScore, 1.0),
      enterpriseGrade: totalScore > 0.4 // Lowered threshold from 0.6 to 0.4
    };
  }

  /**
   * Calculate text similarity using Jaccard index
   */
  calculateSimilarity(str1, str2) {
    const set1 = new Set(str1.split(' '));
    const set2 = new Set(str2.split(' '));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }

  /**
   * Calculate overall quality score for the article set
   */
  calculateQualityScore(articles) {
    if (articles.length === 0) return 0;

    const avgRelevance = articles.reduce((sum, a) => sum + (a.relevanceScore || 0), 0) / articles.length;
    const avgCredibility = articles.reduce((sum, a) => sum + (a.credibilityScore || 0), 0) / articles.length;
    const sourcesDiversity = new Set(articles.map(a => a.sourceApi)).size / 5; // Max 5 sources
    const enterpriseGradeRatio = articles.filter(a => a.enterpriseGrade).length / articles.length;

    return (avgRelevance * 0.3 + avgCredibility * 0.3 + sourcesDiversity * 0.2 + enterpriseGradeRatio * 0.2);
  }

  /**
   * Calculate detailed source statistics
   */
  calculateSourceStatistics(finalArticles, sourceResults) {
    const sourceDistribution = {};
    const totalFinalArticles = finalArticles.length;

    // Count articles by source in final results
    finalArticles.forEach(article => {
      const source = article.sourceApi;
      sourceDistribution[source] = (sourceDistribution[source] || 0) + 1;
    });

    // Calculate diversity metrics
    const uniqueSources = Object.keys(sourceDistribution).length;
    const diversityScore = uniqueSources / 5; // Max 5 sources

    // Calculate source efficiency (final articles / raw articles)
    const sourceEfficiency = {};
    Object.keys(sourceResults).forEach(source => {
      const rawCount = sourceResults[source].count || 0;
      const finalCount = sourceDistribution[source] || 0;
      sourceEfficiency[source] = rawCount > 0 ? (finalCount / rawCount) : 0;
    });

    return {
      sourceDistribution,
      sourceEfficiency,
      uniqueSourcesUsed: uniqueSources,
      totalSourcesAvailable: Object.keys(sourceResults).length,
      diversityScore,
      averageArticlesPerSource: totalFinalArticles / Math.max(uniqueSources, 1),
      borogueRelevantCount: finalArticles.filter(a => a.borogueImpactScore > 0.3).length
    };
  }

  /**
   * Rate limit management
   */
  canMakeRequest(source) {
    return this.rateLimits[source].used < this.rateLimits[source].daily;
  }

  /**
   * Get date range for API queries
   */
  getDateRange(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  }

  /**
   * Get NYT specific date format
   */
  getNYTDateRange(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10).replace(/-/g, '');
  }

  /**
   * Get enterprise usage statistics
   */
  getEnterpriseStats() {
    return {
      rateLimits: this.rateLimits,
      targetArticles: this.targetArticles,
      maxArticles: this.maxArticles,
      activeSources: Object.keys(this.apiKeys).length,
      enterpriseGrade: true
    };
  }

  /**
   * Reset daily counters (called by scheduler)
   */
  resetDailyCounters() {
    Object.keys(this.rateLimits).forEach(source => {
      this.rateLimits[source].used = 0;
    });
    console.log('🔄 Enterprise rate limits reset for new day');
  }
}

module.exports = EnterpriseNewsOrchestrator;
