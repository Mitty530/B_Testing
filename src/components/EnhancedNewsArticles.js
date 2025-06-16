import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EnhancedNewsArticles = ({ articles, totalSources }) => {
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');

  const getRelevanceColor = (score) => {
    if (score >= 0.7) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 0.5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 0.3) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRelevanceLabel = (score) => {
    if (score >= 0.7) return 'High';
    if (score >= 0.5) return 'Medium';
    if (score >= 0.3) return 'Low';
    return 'Minimal';
  };

  const getSourceCredibility = (source) => {
    const trustedSources = [
      'reuters', 'bloomberg', 'financial times', 'wall street journal',
      'chemical week', 'icis', 'plastics news', 'oil gas journal'
    ];
    
    const sourceLower = source.toLowerCase();
    const isTrusted = trustedSources.some(trusted => sourceLower.includes(trusted));
    
    return isTrusted ? 'High' : 'Standard';
  };

  const getCredibilityColor = (credibility) => {
    return credibility === 'High' 
      ? 'text-blue-600 bg-blue-50 border-blue-200'
      : 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'Recent';
    }
  };

  const sortedArticles = [...(articles || [])].sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      case 'date':
        return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
      case 'source':
        return (a.source || '').localeCompare(b.source || '');
      default:
        return 0;
    }
  });

  const toggleExpanded = (index) => {
    setExpandedArticle(expandedArticle === index ? null : index);
  };

  if (!articles || articles.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
          <p className="text-gray-600">Try a different search query to find relevant news articles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                📰 News Intelligence
              </h2>
              <p className="text-gray-600 mt-1">
                {totalSources} sources analyzed • {articles.length} relevant articles
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date</option>
                <option value="source">Source</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6">
        {sortedArticles.map((article, index) => {
          const relevanceScore = article.relevanceScore || 0;
          const credibility = getSourceCredibility(article.source || '');
          const isExpanded = expandedArticle === index;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card hover:shadow-lg transition-all duration-300"
            >
              <div className="card-body">
                {/* Article Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2">
                      {article.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium">{article.source}</span>
                      <span>•</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <div className={`px-2 py-1 text-xs font-medium rounded-full border ${getRelevanceColor(relevanceScore)}`}>
                      {getRelevanceLabel(relevanceScore)} ({Math.round(relevanceScore * 100)}%)
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full border ${getCredibilityColor(credibility)}`}>
                      {credibility} Source
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {isExpanded 
                      ? (article.content || article.description)
                      : `${(article.content || article.description || '').substring(0, 200)}${(article.content || article.description || '').length > 200 ? '...' : ''}`
                    }
                  </p>
                </div>

                {/* Article Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    {(article.content || article.description || '').length > 200 && (
                      <button
                        onClick={() => toggleExpanded(index)}
                        className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                      >
                        {isExpanded ? 'Show Less' : 'Read More'}
                      </button>
                    )}
                    
                    {article.url && article.url !== '#' && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        View Source
                        <span className="text-xs">↗</span>
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Relevance Score:</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${relevanceScore * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full ${relevanceScore >= 0.7 ? 'bg-green-500' : 
                          relevanceScore >= 0.5 ? 'bg-yellow-500' : 
                          relevanceScore >= 0.3 ? 'bg-orange-500' : 'bg-red-500'}`}
                      />
                    </div>
                    <span>{Math.round(relevanceScore * 100)}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card bg-gray-50"
      >
        <div className="card-body">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{articles.length}</div>
              <div className="text-sm text-gray-600">Articles Analyzed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {articles.filter(a => (a.relevanceScore || 0) >= 0.7).length}
              </div>
              <div className="text-sm text-gray-600">High Relevance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {articles.filter(a => getSourceCredibility(a.source || '') === 'High').length}
              </div>
              <div className="text-sm text-gray-600">Trusted Sources</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700">
                {Math.round((articles.reduce((sum, a) => sum + (a.relevanceScore || 0), 0) / articles.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Avg. Relevance</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedNewsArticles;
