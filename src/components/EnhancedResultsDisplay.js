import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExecutiveDashboard from './ExecutiveDashboard';
import EnhancedNewsArticles from './EnhancedNewsArticles';

const EnhancedResultsDisplay = ({ results }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showExportModal, setShowExportModal] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: '📊' },
    { id: 'analysis', label: 'Detailed Analysis', icon: '🔍' },
    { id: 'news', label: 'News Intelligence', icon: '📰' },
    { id: 'insights', label: 'Strategic Insights', icon: '💡' }
  ];

  const handleExport = (format) => {
    // Export functionality would be implemented here
    console.log(`Exporting as ${format}`);
    setShowExportModal(false);
  };

  const formatProcessingTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (!results) return null;

  const { intelligence, borogueContext, topSources, processingTime, confidence, totalSources } = results;

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ESG Intelligence Report
              </h1>
              <p className="text-gray-600">
                Query: "{results.originalQuery}" • 
                Generated in {formatProcessingTime(processingTime)} • 
                Confidence: {Math.round(confidence * 100)}%
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExportModal(true)}
                className="btn btn-outline flex items-center gap-2"
              >
                📥 Export
              </button>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">Analysis Quality</div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${confidence >= 0.8 ? 'bg-green-500' : 
                        confidence >= 0.6 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                    />
                  </div>
                  <span className="text-sm font-medium">{Math.round(confidence * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="card-body py-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && (
            <ExecutiveDashboard 
              intelligence={intelligence} 
              borogueContext={borogueContext} 
            />
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Financial Impact Analysis */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900">💰 Financial Impact Analysis</h3>
                </div>
                <div className="card-body">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Short Term (0-2 years)</h4>
                      <p className="text-red-700 text-sm">{intelligence?.financialImpact?.shortTerm}</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Medium Term (2-5 years)</h4>
                      <p className="text-yellow-700 text-sm">{intelligence?.financialImpact?.mediumTerm}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Long Term (5+ years)</h4>
                      <p className="text-green-700 text-sm">{intelligence?.financialImpact?.longTerm}</p>
                    </div>
                  </div>
                  {intelligence?.financialImpact?.investmentRequired && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Investment Required</h4>
                      <p className="text-blue-700 text-sm">{intelligence.financialImpact.investmentRequired}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Critical Findings */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900">🎯 Detailed Critical Findings</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-6">
                    {intelligence?.criticalFindings?.map((finding, index) => (
                      <div key={index} className="border-l-4 border-primary pl-6 py-4">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">{finding.title}</h4>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full
                            ${finding.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                              finding.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'}`}>
                            {finding.priority}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{finding.description}</p>
                        
                        {finding.borogueSpecificImpact && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <h5 className="font-medium text-blue-800 mb-2">Borouge-Specific Impact</h5>
                            <p className="text-blue-700 text-sm">{finding.borogueSpecificImpact}</p>
                          </div>
                        )}
                        
                        {finding.competitiveImplication && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                            <h5 className="font-medium text-orange-800 mb-2">Competitive Implications</h5>
                            <p className="text-orange-700 text-sm">{finding.competitiveImplication}</p>
                          </div>
                        )}
                        
                        {finding.actionRequired && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h5 className="font-medium text-green-800 mb-2">Required Actions</h5>
                            <p className="text-green-700 text-sm">{finding.actionRequired}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <EnhancedNewsArticles 
              articles={topSources} 
              totalSources={totalSources} 
            />
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              {/* Strategic Recommendations */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-bold text-gray-900">🚀 Strategic Recommendations</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    {intelligence?.strategicRecommendations?.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Risk-Opportunity Matrix */}
              {intelligence?.riskOpportunityMatrix && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-xl font-bold text-gray-900">⚖️ Risk-Opportunity Matrix</h3>
                  </div>
                  <div className="card-body">
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-red-800 flex items-center gap-2">
                          ⚠️ Key Risks
                        </h4>
                        {Object.entries(intelligence.riskOpportunityMatrix)
                          .filter(([key]) => key.toLowerCase().includes('risk'))
                          .map(([key, value], index) => (
                            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <h5 className="font-medium text-red-800 capitalize mb-2">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h5>
                              <p className="text-red-700 text-sm">{value}</p>
                            </div>
                          ))}
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-green-800 flex items-center gap-2">
                          🎯 Opportunities
                        </h4>
                        {Object.entries(intelligence.riskOpportunityMatrix)
                          .filter(([key]) => key.toLowerCase().includes('opportunity'))
                          .map(([key, value], index) => (
                            <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <h5 className="font-medium text-green-800 capitalize mb-2">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </h5>
                              <p className="text-green-700 text-sm">{value}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Monitoring Requirements */}
              {intelligence?.monitoringRequirements && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-xl font-bold text-gray-900">📊 Monitoring Requirements</h3>
                  </div>
                  <div className="card-body">
                    <p className="text-gray-700 leading-relaxed">{intelligence.monitoringRequirements}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Export Report</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full btn btn-primary justify-start"
                >
                  📄 Export as PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full btn btn-secondary justify-start"
                >
                  📊 Export as Excel
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full btn btn-outline justify-start"
                >
                  💾 Export as JSON
                </button>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedResultsDisplay;
