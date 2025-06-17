import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Eye,
  Target,
  Zap,
  Globe
} from 'lucide-react';

const EnterpriseResultsDisplay = ({ results, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!results) return null;

  const { intelligence, topSources, processingTime, confidence, totalSources } = results;

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
    { id: 'analysis', label: 'Detailed Analysis', icon: Target },
    { id: 'intelligence', label: 'Strategic Intelligence', icon: Zap },
    { id: 'sources', label: 'News Sources', icon: Globe }
  ];

  const formatProcessingTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-white/20 backdrop-blur-sm bg-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={onBack}
                className="btn-glass p-3 rounded-xl hover:scale-105 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ESG Intelligence Report</h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Generated in {formatProcessingTime(processingTime)}</span>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getConfidenceColor(confidence)}`}>
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">{getConfidenceLabel(confidence)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>{totalSources} sources analyzed</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Removed save, share, and export buttons as requested */}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="border-b border-gray-200 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </motion.div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="premium-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Risk Level</h3>
                      <AlertTriangle className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-orange-600 mb-2">Medium</div>
                    <p className="text-gray-600 text-sm">Regulatory compliance required</p>
                  </div>

                  <div className="premium-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Market Impact</h3>
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">Positive</div>
                    <p className="text-gray-600 text-sm">Growth opportunities identified</p>
                  </div>

                  <div className="premium-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Urgency</h3>
                      <Clock className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">6 Months</div>
                    <p className="text-gray-600 text-sm">Recommended action timeline</p>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="premium-card p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Executive Summary</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {intelligence?.executiveSummary || 'Comprehensive analysis of the strategic intelligence query reveals key insights and recommendations for Borouge\'s decision-making process.'}
                    </p>
                    
                    {intelligence?.keyFindings && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Findings</h3>
                        <ul className="space-y-2">
                          {intelligence.keyFindings.slice(0, 3).map((finding, index) => (
                            <li key={index} className="text-blue-800 flex items-start space-x-2">
                              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Strategic Recommendations */}
                {intelligence?.strategicRecommendations && (
                  <div className="premium-card p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Strategic Recommendations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {intelligence.strategicRecommendations.slice(0, 4).map((recommendation, index) => (
                        <div key={index} className="glass-card p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                            <p className="text-gray-700 leading-relaxed">{recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-8">
                {/* Executive Summary */}
                {results?.intelligence?.executiveSummary && (
                  <div className="premium-card p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Executive Summary</h2>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {results.intelligence.executiveSummary}
                      </p>
                    </div>
                  </div>
                )}

                {/* Critical Findings */}
                {results?.intelligence?.criticalFindings && results.intelligence.criticalFindings.length > 0 && (
                  <div className="premium-card p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Critical Findings</h2>
                    <div className="space-y-4">
                      {results.intelligence.criticalFindings.map((finding, index) => (
                        <div key={index} className="border-l-4 border-red-500 pl-6 py-3 bg-red-50 rounded-r-lg">
                          <h3 className="font-semibold text-red-900 mb-2">{finding.title || finding}</h3>
                          {finding.description && (
                            <p className="text-red-800">{finding.description}</p>
                          )}
                          {finding.priority && (
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                              finding.priority === 'HIGH' ? 'bg-red-200 text-red-800' :
                              finding.priority === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-green-200 text-green-800'
                            }`}>
                              {finding.priority} PRIORITY
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Financial Impact */}
                {results?.intelligence?.financialImpact && (
                  <div className="premium-card p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Impact Assessment</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {results.intelligence.financialImpact.shortTerm && (
                        <div className="bg-blue-50 p-6 rounded-xl">
                          <h3 className="font-semibold text-blue-900 mb-3">Short Term (0-2 years)</h3>
                          <p className="text-blue-800">{results.intelligence.financialImpact.shortTerm}</p>
                        </div>
                      )}
                      {results.intelligence.financialImpact.mediumTerm && (
                        <div className="bg-yellow-50 p-6 rounded-xl">
                          <h3 className="font-semibold text-yellow-900 mb-3">Medium Term (2-5 years)</h3>
                          <p className="text-yellow-800">{results.intelligence.financialImpact.mediumTerm}</p>
                        </div>
                      )}
                      {results.intelligence.financialImpact.longTerm && (
                        <div className="bg-green-50 p-6 rounded-xl">
                          <h3 className="font-semibold text-green-900 mb-3">Long Term (5+ years)</h3>
                          <p className="text-green-800">{results.intelligence.financialImpact.longTerm}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Strategic Recommendations */}
                {results?.intelligence?.strategicRecommendations && results.intelligence.strategicRecommendations.length > 0 && (
                  <div className="premium-card p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Strategic Recommendations</h2>
                    <div className="space-y-4">
                      {results.intelligence.strategicRecommendations.map((recommendation, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-6 py-3 bg-blue-50 rounded-r-lg">
                          <h3 className="font-semibold text-blue-900 mb-2">{recommendation.title || recommendation}</h3>
                          {recommendation.description && (
                            <p className="text-blue-800 mb-2">{recommendation.description}</p>
                          )}
                          {recommendation.timeframe && (
                            <span className="inline-block px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                              {recommendation.timeframe}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'intelligence' && (
              <div className="space-y-8">
                {/* Borouge Context Overview */}
                {results?.borogueContext?.executiveSummary && (
                  <div className="premium-card p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Strategic Overview</h2>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {results.borogueContext.executiveSummary}
                      </p>
                    </div>
                  </div>
                )}

                {/* Priority Findings */}
                {results?.borogueContext?.priorityFindings && results.borogueContext.priorityFindings.length > 0 && (
                  <div className="premium-card p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Priority Strategic Findings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.borogueContext.priorityFindings.map((finding, index) => (
                        <div key={index} className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
                          <div className="flex items-center mb-3">
                            <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                            <span className="font-semibold text-orange-900">High Priority</span>
                          </div>
                          <p className="text-orange-800">{finding}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Financial Exposure */}
                {results?.borogueContext?.financialExposure && (
                  <div className="premium-card p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Exposure Analysis</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {results.borogueContext.financialExposure.shortTerm && (
                        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                          <h3 className="font-semibold text-red-900 mb-3">Short Term</h3>
                          <p className="text-red-800 text-sm">{results.borogueContext.financialExposure.shortTerm}</p>
                        </div>
                      )}
                      {results.borogueContext.financialExposure.mediumTerm && (
                        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                          <h3 className="font-semibold text-yellow-900 mb-3">Medium Term</h3>
                          <p className="text-yellow-800 text-sm">{results.borogueContext.financialExposure.mediumTerm}</p>
                        </div>
                      )}
                      {results.borogueContext.financialExposure.longTerm && (
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                          <h3 className="font-semibold text-blue-900 mb-3">Long Term</h3>
                          <p className="text-blue-800 text-sm">{results.borogueContext.financialExposure.longTerm}</p>
                        </div>
                      )}
                      {results.borogueContext.financialExposure.investmentRequired && (
                        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                          <h3 className="font-semibold text-purple-900 mb-3">Investment Required</h3>
                          <p className="text-purple-800 text-sm">{results.borogueContext.financialExposure.investmentRequired}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Strategic Actions */}
                {results?.borogueContext?.strategicActions && results.borogueContext.strategicActions.length > 0 && (
                  <div className="premium-card p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Strategic Actions</h2>
                    <div className="space-y-4">
                      {results.borogueContext.strategicActions.map((action, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-6 py-4 bg-green-50 rounded-r-lg">
                          <h3 className="font-semibold text-green-900 mb-2">{action.title || action}</h3>
                          {action.description && (
                            <p className="text-green-800 mb-2">{action.description}</p>
                          )}
                          {action.priority && (
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              action.priority === 'HIGH' ? 'bg-red-200 text-red-800' :
                              action.priority === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-green-200 text-green-800'
                            }`}>
                              {action.priority} PRIORITY
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk Level Assessment */}
                {results?.borogueContext?.riskLevel && (
                  <div className="premium-card p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Assessment</h2>
                    <div className={`p-6 rounded-xl border-2 ${
                      results.borogueContext.riskLevel === 'HIGH' ? 'bg-red-50 border-red-200' :
                      results.borogueContext.riskLevel === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center mb-4">
                        <AlertTriangle className={`w-8 h-8 mr-3 ${
                          results.borogueContext.riskLevel === 'HIGH' ? 'text-red-600' :
                          results.borogueContext.riskLevel === 'MEDIUM' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                        <div>
                          <h3 className={`text-2xl font-bold ${
                            results.borogueContext.riskLevel === 'HIGH' ? 'text-red-900' :
                            results.borogueContext.riskLevel === 'MEDIUM' ? 'text-yellow-900' :
                            'text-green-900'
                          }`}>
                            {results.borogueContext.riskLevel} RISK
                          </h3>
                          <p className={`${
                            results.borogueContext.riskLevel === 'HIGH' ? 'text-red-700' :
                            results.borogueContext.riskLevel === 'MEDIUM' ? 'text-yellow-700' :
                            'text-green-700'
                          }`}>
                            Overall strategic risk assessment for Borouge operations
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sources' && (
              <div className="space-y-6">
                <div className="premium-card p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">News Sources Analysis</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-2">Total Articles Found</h3>
                      <div className="text-2xl font-bold text-blue-700">
                        {results?.newsResults?.rawArticleCount || 0}
                      </div>
                      <p className="text-sm text-blue-600">Raw articles collected</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-2">High-Quality Articles</h3>
                      <div className="text-2xl font-bold text-green-700">
                        {results?.newsResults?.finalArticleCount || totalSources}
                      </div>
                      <p className="text-sm text-green-600">After enterprise filtering</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h3 className="font-semibold text-purple-900 mb-2">Source Diversity</h3>
                      <div className="text-2xl font-bold text-purple-700">
                        {results?.newsResults?.sourceStatistics?.uniqueSourcesUsed || 0}/{results?.newsResults?.totalSources || 5}
                      </div>
                      <p className="text-sm text-purple-600">Active news sources</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Enterprise-grade analysis from {results?.newsResults?.sourceStatistics?.uniqueSourcesUsed || totalSources} premium news sources with {((results?.newsResults?.qualityScore || 0) * 100).toFixed(1)}% quality score.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topSources?.slice(0, 9).map((source, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="premium-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                      onClick={() => source.url && window.open(source.url, '_blank')}
                    >
                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                        {source.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {source.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="font-medium">{source.source}</span>
                        <span>{new Date(source.publishedAt).toLocaleDateString()}</span>
                      </div>
                      {source.url && (
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                          <span>Read full article</span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default EnterpriseResultsDisplay;
