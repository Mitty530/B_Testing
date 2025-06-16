import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  DollarSign, 
  Clock, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BarChart3,
  FileText,
  Lightbulb
} from 'lucide-react';

const ResultsDisplay = ({ results }) => {
  const [activeTab, setActiveTab] = useState('executive');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getQueryTypeIcon = (type) => {
    const icons = {
      regulatory_intelligence: '📋',
      competitive_intelligence: '🏢',
      market_analysis: '📊',
      esg_analysis: '🌱',
      technology_intelligence: '🔬',
      general_intelligence: '🔍'
    };
    return icons[type] || '🔍';
  };

  const tabs = [
    { id: 'executive', label: 'Executive Summary', icon: Target },
    { id: 'findings', label: 'Critical Findings', icon: AlertTriangle },
    { id: 'financial', label: 'Financial Impact', icon: DollarSign },
    { id: 'strategic', label: 'Strategic Actions', icon: Lightbulb },
    { id: 'sources', label: 'Sources', icon: FileText }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getQueryTypeIcon(results.queryType)}</span>
            <div>
              <h2 className="text-xl font-bold text-blue-900">
                ESG Intelligence Analysis Complete
              </h2>
              <p className="text-blue-700">Query: "{results.originalQuery}"</p>
            </div>
          </div>
          
          <div className="text-right text-sm text-blue-600">
            <div>Sources: {results.totalSources}</div>
            <div>Confidence: {Math.round(results.confidence * 100)}%</div>
            <div>Processing: {results.processingTime}ms</div>
          </div>
        </div>

        {/* Executive Summary Preview */}
        {results.intelligence?.executiveSummary && (
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Executive Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {results.intelligence.executiveSummary}
            </p>
          </div>
        )}
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Executive Summary Tab */}
        {activeTab === 'executive' && (
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Executive Summary
            </h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">
                {results.intelligence?.executiveSummary || 'Executive summary not available.'}
              </p>
            </div>
          </div>
        )}

        {/* Critical Findings Tab */}
        {activeTab === 'findings' && (
          <div className="space-y-4">
            {results.intelligence?.criticalFindings?.map((finding, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {finding.title}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(finding.priority)}`}>
                    {finding.priority} Priority
                  </span>
                </div>
                
                <div className="space-y-3">
                  <p className="text-gray-700">{finding.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">Borouge Impact:</h5>
                      <p className="text-gray-600 text-sm">{finding.borogueSpecificImpact}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">Competitive Implication:</h5>
                      <p className="text-gray-600 text-sm">{finding.competitiveImplication}</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-1">Action Required:</h5>
                    <p className="text-blue-700 text-sm">{finding.actionRequired}</p>
                  </div>
                </div>
              </motion.div>
            )) || (
              <div className="card text-center py-8">
                <p className="text-gray-500">No critical findings available.</p>
              </div>
            )}
          </div>
        )}

        {/* Financial Impact Tab */}
        {activeTab === 'financial' && (
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Financial Impact Analysis
            </h3>
            
            {results.intelligence?.financialImpact ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Short-term (0-2 years)
                    </h4>
                    <p className="text-blue-700 text-sm">
                      {results.intelligence.financialImpact.shortTerm}
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Medium-term (2-5 years)
                    </h4>
                    <p className="text-orange-700 text-sm">
                      {results.intelligence.financialImpact.mediumTerm}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Long-term (5-10 years)
                    </h4>
                    <p className="text-green-700 text-sm">
                      {results.intelligence.financialImpact.longTerm}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Investment Required
                    </h4>
                    <p className="text-purple-700 text-sm">
                      {results.intelligence.financialImpact.investmentRequired}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Financial impact analysis not available.</p>
              </div>
            )}
          </div>
        )}

        {/* Strategic Actions Tab */}
        {activeTab === 'strategic' && (
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              Strategic Recommendations
            </h3>
            
            {results.intelligence?.strategicRecommendations?.length > 0 ? (
              <div className="space-y-4">
                {results.intelligence.strategicRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 flex-1">{recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Strategic recommendations not available.</p>
              </div>
            )}
          </div>
        )}

        {/* Sources Tab */}
        {activeTab === 'sources' && (
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-600" />
              Top Sources ({results.topSources?.length || 0})
            </h3>
            
            {results.topSources?.length > 0 ? (
              <div className="space-y-4">
                {results.topSources.map((source, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 flex-1 pr-4">
                        {source.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Relevance: {Math.round((source.relevanceScore || 0) * 100)}%</span>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{source.source}</span>
                      <span>•</span>
                      <span>{new Date(source.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No sources available.</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResultsDisplay;
