// Supabase Service for Borouge ESG Intelligence
const { createClient } = require('@supabase/supabase-js');

class SupabaseService {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for backend operations
    );
  }

  /**
   * Create a new research session
   */
  async createResearchSession(userId, originalQuery) {
    try {
      const { data, error } = await this.supabase
        .from('research_sessions')
        .insert({
          user_id: userId,
          original_query: originalQuery,
          session_status: 'processing',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating research session:', error);
      throw new Error(`Failed to create research session: ${error.message}`);
    }
  }

  /**
   * Update research session with enhanced query
   */
  async updateSessionWithEnhancedQuery(sessionId, enhancedQuery) {
    try {
      const { error } = await this.supabase
        .from('research_sessions')
        .update({ enhanced_query: enhancedQuery })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating session with enhanced query:', error);
      throw new Error(`Failed to update session: ${error.message}`);
    }
  }

  /**
   * Store news articles for a session
   */
  async storeNewsArticles(sessionId, articles) {
    try {
      if (!articles || articles.length === 0) return;

      const articleInserts = articles.map(article => ({
        session_id: sessionId,
        source_name: article.source,
        url: article.url,
        title: article.title,
        description: article.description,
        content: article.content,
        published_at: article.publishedAt,
        relevance_score: article.relevanceScore,
        source_credibility: article.credibilityScore,
        borouge_impact: article.borogueImpact,
        image_url: article.imageUrl
      }));

      const { error } = await this.supabase
        .from('news_sources')
        .insert(articleInserts);

      if (error) throw error;
    } catch (error) {
      console.error('Error storing news articles:', error);
      throw new Error(`Failed to store news articles: ${error.message}`);
    }
  }

  /**
   * Store LLM analysis results
   */
  async storeLLMAnalysis(sessionId, analysisData) {
    try {
      const { error } = await this.supabase
        .from('llm_analysis')
        .insert({
          session_id: sessionId,
          analysis_type: analysisData.queryType,
          llm_response: analysisData.rawAnalysis,
          structured_analysis: analysisData.structuredAnalysis,
          confidence_score: analysisData.confidence,
          borouge_context: analysisData.borogueContext,
          financial_impact: analysisData.structuredAnalysis?.financialImpact,
          strategic_recommendations: analysisData.structuredAnalysis?.strategicRecommendations,
          critical_findings: analysisData.structuredAnalysis?.criticalFindings
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing LLM analysis:', error);
      throw new Error(`Failed to store LLM analysis: ${error.message}`);
    }
  }

  /**
   * Complete research session
   */
  async completeResearchSession(sessionId, totalSources, confidence, processingTime) {
    try {
      const { error } = await this.supabase
        .from('research_sessions')
        .update({
          session_status: 'completed',
          completed_at: new Date().toISOString(),
          total_sources: totalSources,
          confidence_score: confidence,
          processing_time_ms: processingTime
        })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error completing research session:', error);
      throw new Error(`Failed to complete research session: ${error.message}`);
    }
  }

  /**
   * Mark session as failed
   */
  async markSessionAsFailed(sessionId, errorMessage) {
    try {
      const { error } = await this.supabase
        .from('research_sessions')
        .update({
          session_status: 'error',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking session as failed:', error);
    }
  }

  /**
   * Get research session history for a user
   */
  async getResearchHistory(userId, limit = 20) {
    try {
      const { data, error } = await this.supabase
        .from('research_sessions')
        .select(`
          id,
          original_query,
          enhanced_query,
          session_status,
          started_at,
          completed_at,
          total_sources,
          confidence_score,
          query_type,
          processing_time_ms
        `)
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching research history:', error);
      throw new Error(`Failed to fetch research history: ${error.message}`);
    }
  }

  /**
   * Get detailed session information
   */
  async getSessionDetails(sessionId) {
    try {
      // Get session details
      const { data: session, error: sessionError } = await this.supabase
        .from('research_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Get articles for this session
      const { data: articles, error: articlesError } = await this.supabase
        .from('news_sources')
        .select('*')
        .eq('session_id', sessionId)
        .order('relevance_score', { ascending: false });

      if (articlesError) throw articlesError;

      // Get analysis for this session
      const { data: analysis, error: analysisError } = await this.supabase
        .from('llm_analysis')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (analysisError) throw analysisError;

      return {
        session,
        articles,
        analysis: analysis[0] || null,
        totalSources: articles.length
      };
    } catch (error) {
      console.error('Error fetching session details:', error);
      throw new Error(`Failed to fetch session details: ${error.message}`);
    }
  }

  /**
   * Store user feedback for learning
   */
  async storeUserFeedback(originalQuery, enhancedQuery, rating, feedback) {
    try {
      const { error } = await this.supabase
        .from('query_enhancements')
        .insert({
          original_query: originalQuery,
          enhanced_query: enhancedQuery,
          success_score: rating,
          user_feedback: feedback,
          enhancement_context: {
            timestamp: new Date().toISOString(),
            feedback_type: 'user_rating'
          }
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing user feedback:', error);
      throw new Error(`Failed to store user feedback: ${error.message}`);
    }
  }

  /**
   * Track API usage
   */
  async trackAPIUsage(apiName, endpoint, userId, sessionId) {
    try {
      const { error } = await this.supabase
        .from('api_usage')
        .insert({
          api_name: apiName,
          endpoint: endpoint,
          user_id: userId,
          session_id: sessionId,
          date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking API usage:', error);
      // Don't throw error for tracking failures
    }
  }

  /**
   * Get or create default user
   */
  async getOrCreateDefaultUser() {
    try {
      const defaultUserId = '00000000-0000-0000-0000-000000000000';
      
      // Try to get existing user
      const { data: existingUser, error: fetchError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', defaultUserId)
        .single();

      if (existingUser) {
        return existingUser;
      }

      // Create default user if not exists
      const { data: newUser, error: createError } = await this.supabase
        .from('users')
        .insert({
          id: defaultUserId,
          email: 'default@borouge.com',
          name: 'Default User',
          department: 'ESG Intelligence',
          role: 'researcher'
        })
        .select()
        .single();

      if (createError) throw createError;
      return newUser;
    } catch (error) {
      console.error('Error getting/creating default user:', error);
      // Return a fallback user object
      return {
        id: '00000000-0000-0000-0000-000000000000',
        email: 'default@borouge.com',
        name: 'Default User',
        department: 'ESG Intelligence',
        role: 'researcher'
      };
    }
  }

  /**
   * Get database health status
   */
  async getHealthStatus() {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('count')
        .limit(1);

      return {
        status: error ? 'unhealthy' : 'healthy',
        message: error ? error.message : 'Database connection successful',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = SupabaseService;
