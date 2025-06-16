// Gemini AI Service for Borouge ESG Intelligence
const { GoogleGenerativeAI } = require('@google/generative-ai');
const BoPromptLoader = require('../utils/bo-prompt-loader');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.boPromptLoader = new BoPromptLoader();
    this.requestCount = 0;
    this.maxDailyRequests = 50; // Conservative limit for free tier
  }

  /**
   * Generate Borouge ESG intelligence analysis
   */
  async generateESGIntelligence(articles, originalQuery) {
    try {
      if (this.requestCount >= this.maxDailyRequests) {
        throw new Error('Daily Gemini API limit reached');
      }

      if (!articles || articles.length === 0) {
        throw new Error('No articles provided for analysis');
      }

      this.requestCount++;

      // Build enhanced prompt using Bo_Prompt
      const enhancedPrompt = this.boPromptLoader.buildEnhancedPrompt(originalQuery, articles);
      
      console.log('Generating ESG intelligence with Gemini...');
      console.log('Articles count:', articles.length);
      console.log('Query:', originalQuery);

      // Generate content with Gemini
      const result = await this.model.generateContent(enhancedPrompt);
      const response = await result.response;
      const rawAnalysis = response.text();

      console.log('Gemini response received, length:', rawAnalysis.length);

      // Parse the response using Bo_Prompt loader
      const parsedResponse = this.boPromptLoader.parseBoPromptResponse(rawAnalysis);

      // Extract additional context
      const borogueContext = this.extractBorogueContext(parsedResponse.structuredAnalysis, originalQuery);
      const queryType = this.detectQueryType(originalQuery);
      const confidence = this.calculateConfidence(articles.length, parsedResponse.hasValidJson);

      return {
        rawAnalysis: parsedResponse.rawAnalysis,
        structuredAnalysis: parsedResponse.structuredAnalysis,
        borogueContext: borogueContext,
        queryType: queryType,
        confidence: confidence,
        sourceCount: articles.length,
        hasValidJson: parsedResponse.hasValidJson,
        topSources: articles.slice(0, 5).map(article => ({
          title: article.title,
          source: article.source,
          url: article.url,
          relevanceScore: article.relevanceScore,
          publishedAt: article.publishedAt
        })),
        processingMetadata: {
          timestamp: new Date().toISOString(),
          requestsRemaining: this.maxDailyRequests - this.requestCount,
          promptLength: enhancedPrompt.length,
          responseLength: rawAnalysis.length
        }
      };

    } catch (error) {
      console.error('Gemini ESG intelligence generation error:', error);
      throw new Error(`ESG intelligence generation failed: ${error.message}`);
    }
  }

  /**
   * Detect query type for categorization
   */
  detectQueryType(query) {
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('regulat') || lowercaseQuery.includes('polic') || lowercaseQuery.includes('compli')) {
      return 'regulatory_intelligence';
    } else if (lowercaseQuery.includes('compet') || lowercaseQuery.includes('sabic') || lowercaseQuery.includes('dow')) {
      return 'competitive_intelligence';
    } else if (lowercaseQuery.includes('market') || lowercaseQuery.includes('price') || lowercaseQuery.includes('demand')) {
      return 'market_analysis';
    } else if (lowercaseQuery.includes('esg') || lowercaseQuery.includes('sustain') || lowercaseQuery.includes('carbon')) {
      return 'esg_analysis';
    } else if (lowercaseQuery.includes('technolog') || lowercaseQuery.includes('innovat') || lowercaseQuery.includes('r&d')) {
      return 'technology_intelligence';
    } else {
      return 'general_intelligence';
    }
  }

  /**
   * Extract Borouge-specific context from analysis
   */
  extractBorogueContext(structuredAnalysis, originalQuery) {
    if (!structuredAnalysis) return {};
    
    return {
      executiveSummary: structuredAnalysis.executiveSummary || '',
      priorityFindings: (structuredAnalysis.criticalFindings || [])
        .filter(f => f.priority === 'HIGH')
        .map(f => f.title),
      financialExposure: {
        shortTerm: structuredAnalysis.financialImpact?.shortTerm || '',
        mediumTerm: structuredAnalysis.financialImpact?.mediumTerm || '',
        longTerm: structuredAnalysis.financialImpact?.longTerm || '',
        investmentRequired: structuredAnalysis.financialImpact?.investmentRequired || ''
      },
      competitivePositioning: structuredAnalysis.competitiveBenchmarking || '',
      strategicActions: structuredAnalysis.strategicRecommendations || [],
      riskLevel: this.assessRiskLevel(structuredAnalysis.criticalFindings || []),
      monitoringNeeds: structuredAnalysis.monitoringRequirements || '',
      revenueImpact: this.extractFinancialMentions(JSON.stringify(structuredAnalysis)),
      timeframe: this.extractTimeframeMentions(JSON.stringify(structuredAnalysis)),
      competitors: this.extractCompetitorMentions(JSON.stringify(structuredAnalysis)),
      originalQuery: originalQuery,
      analysisTimestamp: new Date().toISOString()
    };
  }

  /**
   * Assess risk level from critical findings
   */
  assessRiskLevel(criticalFindings) {
    const highPriorityCount = criticalFindings.filter(f => f.priority === 'HIGH').length;
    const mediumPriorityCount = criticalFindings.filter(f => f.priority === 'MEDIUM').length;
    
    if (highPriorityCount >= 2) return 'HIGH';
    if (highPriorityCount >= 1 || mediumPriorityCount >= 3) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Extract financial mentions from text
   */
  extractFinancialMentions(text) {
    const financialPatterns = [
      /\$\d+\.?\d*\s*[bB]illion/g,
      /€\d+\.?\d*\s*[bB]illion/g,
      /\d+%\s*of\s*revenue/g,
      /EBITDA.*\d+/g
    ];
    
    let mentions = [];
    financialPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) mentions.push(...matches);
    });
    
    return mentions;
  }

  /**
   * Extract timeframe mentions from text
   */
  extractTimeframeMentions(text) {
    const timePatterns = [
      /\d+-\d+\s*years?/g,
      /immediate/gi,
      /short[- ]?term/gi,
      /long[- ]?term/gi,
      /\d+\s*months?/g
    ];
    
    let timeframes = [];
    timePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) timeframes.push(...matches);
    });
    
    return timeframes;
  }

  /**
   * Extract competitor mentions from text
   */
  extractCompetitorMentions(text) {
    const competitors = ['SABIC', 'Dow', 'ExxonMobil', 'EQUATE', 'QAPCO', 'Borealis'];
    return competitors.filter(comp => 
      text.toLowerCase().includes(comp.toLowerCase())
    );
  }

  /**
   * Calculate confidence score based on various factors
   */
  calculateConfidence(sourceCount, hasValidJson) {
    let confidence = 0.5; // Base confidence
    
    // Source count factor
    if (sourceCount >= 10) confidence += 0.3;
    else if (sourceCount >= 5) confidence += 0.2;
    else if (sourceCount >= 3) confidence += 0.1;
    
    // JSON structure factor
    if (hasValidJson) confidence += 0.2;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Get API usage statistics
   */
  getUsageStats() {
    return {
      dailyRequestCount: this.requestCount,
      maxDailyRequests: this.maxDailyRequests,
      remainingRequests: this.maxDailyRequests - this.requestCount,
      resetTime: 'Daily at 00:00 UTC'
    };
  }

  /**
   * Reset daily counter
   */
  resetDailyCounter() {
    this.requestCount = 0;
  }

  /**
   * Validate query for ESG relevance
   */
  validateESGQuery(query) {
    const esgKeywords = [
      'esg', 'sustainability', 'environmental', 'carbon', 'emissions',
      'governance', 'social', 'regulation', 'policy', 'compliance',
      'circular economy', 'renewable', 'green', 'climate', 'biodiversity'
    ];
    
    const lowercaseQuery = query.toLowerCase();
    const hasESGKeywords = esgKeywords.some(keyword => lowercaseQuery.includes(keyword));
    
    return {
      isValid: hasESGKeywords || query.length > 10, // Allow general queries if substantial
      suggestions: hasESGKeywords ? [] : [
        'carbon emissions petrochemical industry',
        'ESG regulations chemical companies',
        'sustainability initiatives polymer industry',
        'environmental compliance UAE petrochemicals',
        'circular economy plastic recycling'
      ]
    };
  }
}

module.exports = GeminiService;
