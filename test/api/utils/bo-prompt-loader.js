// Bo_Prompt Loader Utility
// Loads and processes the Borouge ESG Intelligence Master Prompt

const fs = require('fs');
const path = require('path');

class BoPromptLoader {
  constructor() {
    this.boPromptContent = null;
    this.isLoaded = false;
  }

  /**
   * Load the Bo_Prompt file content
   */
  loadBoPrompt() {
    try {
      if (this.isLoaded && this.boPromptContent) {
        return this.boPromptContent;
      }

      // Try different possible paths for the Bo_Prompt file
      const possiblePaths = [
        path.join(process.cwd(), 'Bo_Prompt'),
        path.join(process.cwd(), '../Bo_Prompt'),
        path.join(__dirname, '../../Bo_Prompt'),
        path.join(__dirname, '../../../Bo_Prompt')
      ];

      let boPromptPath = null;
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          boPromptPath = possiblePath;
          break;
        }
      }

      if (!boPromptPath) {
        throw new Error('Bo_Prompt file not found in any expected location');
      }

      this.boPromptContent = fs.readFileSync(boPromptPath, 'utf8');
      this.isLoaded = true;

      console.log('Bo_Prompt loaded successfully from:', boPromptPath);
      return this.boPromptContent;

    } catch (error) {
      console.error('Error loading Bo_Prompt:', error);
      throw new Error(`Failed to load Bo_Prompt: ${error.message}`);
    }
  }

  /**
   * Build enhanced prompt with query context
   */
  buildEnhancedPrompt(originalQuery, newsArticles) {
    try {
      const boPrompt = this.loadBoPrompt();
      
      // Prepare articles text for analysis
      const articlesText = newsArticles.slice(0, 8).map((article, index) => 
        `Article ${index + 1}:
Title: ${article.title}
Source: ${article.source}
Date: ${article.publishedAt}
Content: ${article.description || article.content}
Relevance Score: ${article.relevanceScore || 'N/A'}
Impact Assessment: ${article.borogueImpact || 'N/A'}
---`
      ).join('\n\n');

      // Build the complete prompt
      const enhancedPrompt = `${boPrompt}

## 🎯 **QUERY ANALYSIS**
**Original Query**: "${originalQuery}"

**News Intelligence Data:**
${articlesText}

## 📊 **REQUIRED OUTPUT FORMAT**

Provide your analysis in this exact JSON structure:

\`\`\`json
{
  "executiveSummary": "2-3 sentences with quantified business impact magnitude ($), strategic implication (opportunity vs threat), and timeline urgency",
  "criticalFindings": [
    {
      "priority": "HIGH|MEDIUM|LOW",
      "title": "Specific business impact area",
      "description": "Detailed analysis with quantification",
      "borogueSpecificImpact": "Direct implications for Borouge operations/strategy with specific $ amounts",
      "competitiveImplication": "Relative positioning vs SABIC/Dow/ExxonMobil with strategic context",
      "actionRequired": "Specific next steps with responsible function (Legal, Operations, Strategy, Finance)"
    }
  ],
  "financialImpact": {
    "shortTerm": "0-2 years quantified impact with specific $ ranges",
    "mediumTerm": "2-5 years strategic implications with investment requirements", 
    "longTerm": "5-10 years competitive positioning with market leadership opportunities",
    "investmentRequired": "CAPEX/OPEX requirements with specific dollar ranges"
  },
  "strategicRecommendations": [
    "Immediate actions (0-6 months) with specific compliance/risk mitigation steps",
    "Strategic initiatives (6-24 months) with investment decisions and market positioning", 
    "Long-term positioning (2-5 years) with competitive advantage building and innovation"
  ],
  "competitiveBenchmarking": "Detailed analysis vs primary competitors with specific strategic positioning advantages/disadvantages",
  "riskOpportunityMatrix": "Risk mitigation strategies vs opportunity capture with prioritization and resource allocation",
  "monitoringRequirements": "Ongoing intelligence needs with specific metrics, sources, and review frequencies"
}
\`\`\`

**CRITICAL REMINDER**: You are Borouge's strategic intelligence asset, delivering insights that directly influence multi-million dollar business decisions. Every response must be actionable, quantified, and strategically relevant to Borouge's specific market position and competitive challenges. Focus on financial impact, competitive positioning, and strategic recommendations that drive business value.`;

      return enhancedPrompt;

    } catch (error) {
      console.error('Error building enhanced prompt:', error);
      throw new Error(`Failed to build enhanced prompt: ${error.message}`);
    }
  }

  /**
   * Parse Bo_Prompt response and extract structured data
   */
  parseBoPromptResponse(rawResponse) {
    try {
      // Try to extract JSON from the response
      let structuredAnalysis;
      
      // Look for JSON in code blocks
      const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```/) || 
                       rawResponse.match(/```\n([\s\S]*?)\n```/) ||
                       rawResponse.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        try {
          structuredAnalysis = JSON.parse(jsonMatch[1]);
        } catch (parseError) {
          console.warn('JSON parsing failed, creating fallback structure');
          structuredAnalysis = this.createFallbackStructure(rawResponse);
        }
      } else {
        console.warn('No JSON found in response, creating fallback structure');
        structuredAnalysis = this.createFallbackStructure(rawResponse);
      }

      return {
        rawAnalysis: rawResponse,
        structuredAnalysis: structuredAnalysis,
        hasValidJson: !!jsonMatch,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error parsing Bo_Prompt response:', error);
      return {
        rawAnalysis: rawResponse,
        structuredAnalysis: this.createFallbackStructure(rawResponse),
        hasValidJson: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Create fallback structure when JSON parsing fails
   */
  createFallbackStructure(textAnalysis) {
    return {
      executiveSummary: this.extractSection(textAnalysis, 'EXECUTIVE SUMMARY') || 
                       `Strategic analysis completed for Borouge ESG intelligence.`,
      criticalFindings: [{
        priority: "MEDIUM",
        title: "Analysis Results",
        description: this.extractSection(textAnalysis, 'BUSINESS IMPACT') || 
                    textAnalysis.substring(0, 500),
        borogueSpecificImpact: this.extractSection(textAnalysis, 'Borouge') || 
                              "Impact assessment requires detailed review",
        competitiveImplication: this.extractSection(textAnalysis, 'COMPETITIVE') || 
                               "Competitive analysis in progress",
        actionRequired: "Review detailed analysis and determine strategic next steps"
      }],
      financialImpact: {
        shortTerm: "Assessment pending detailed financial analysis",
        mediumTerm: "Strategic investment analysis required",
        longTerm: "Long-term positioning under strategic review",
        investmentRequired: "Investment requirements to be quantified"
      },
      strategicRecommendations: [
        "Review comprehensive analysis findings",
        "Engage relevant business functions for detailed assessment",
        "Develop prioritized action plan based on strategic importance"
      ],
      competitiveBenchmarking: this.extractSection(textAnalysis, 'competitor') || 
                              "Competitive analysis pending",
      riskOpportunityMatrix: "Risk and opportunity assessment in progress",
      monitoringRequirements: "Ongoing monitoring framework to be established"
    };
  }

  /**
   * Extract specific sections from text analysis
   */
  extractSection(text, sectionKeyword) {
    const lines = text.split('\n');
    let extracting = false;
    let extracted = [];
    
    for (const line of lines) {
      if (line.toLowerCase().includes(sectionKeyword.toLowerCase())) {
        extracting = true;
        continue;
      }
      if (extracting && line.trim() === '') {
        if (extracted.length > 0) break;
        continue;
      }
      if (extracting && line.startsWith('##')) {
        break;
      }
      if (extracting) {
        extracted.push(line);
      }
    }
    
    return extracted.join('\n').trim();
  }
}

module.exports = BoPromptLoader;
