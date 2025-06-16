import React from 'react';
import { motion } from 'framer-motion';

const ExecutiveDashboard = ({ intelligence, borogueContext }) => {
  const getRiskLevelColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'HIGH': return 'text-risk-high bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-risk-medium bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-risk-low bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return '🔴';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return '⚪';
    }
  };

  const extractFinancialNumbers = (text) => {
    if (!text) return [];
    const patterns = [
      /€\d+(?:\.\d+)?[BMK]?/g,
      /\$\d+(?:\.\d+)?[BMK]?/g,
      /\d+(?:\.\d+)?%/g
    ];
    
    let matches = [];
    patterns.forEach(pattern => {
      const found = text.match(pattern);
      if (found) matches.push(...found);
    });
    
    return [...new Set(matches)].slice(0, 4); // Unique values, max 4
  };

  const keyMetrics = [
    {
      label: 'Risk Level',
      value: borogueContext?.riskLevel || 'MEDIUM',
      icon: '⚠️',
      color: getRiskLevelColor(borogueContext?.riskLevel)
    },
    {
      label: 'Priority Findings',
      value: borogueContext?.priorityFindings?.length || 0,
      icon: '📊',
      color: 'text-primary bg-primary-50 border-primary-200'
    },
    {
      label: 'Competitors Analyzed',
      value: borogueContext?.competitors?.length || 0,
      icon: '🏢',
      color: 'text-secondary bg-secondary-50 border-secondary-200'
    },
    {
      label: 'Confidence Score',
      value: `${Math.round((intelligence?.confidence || 0) * 100)}%`,
      icon: '🎯',
      color: 'text-accent bg-accent-50 border-accent-200'
    }
  ];

  const financialHighlights = extractFinancialNumbers(
    JSON.stringify(borogueContext?.financialExposure || {})
  );

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            📈 Executive Summary
          </h2>
        </div>
        <div className="card-body">
          <p className="text-lg leading-relaxed text-gray-700">
            {intelligence?.executiveSummary || borogueContext?.executiveSummary}
          </p>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {keyMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`card border-2 ${metric.color}`}
          >
            <div className="card-body text-center">
              <div className="text-2xl mb-2">{metric.icon}</div>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm font-medium">{metric.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Financial Impact Overview */}
      {financialHighlights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              💰 Financial Impact Highlights
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {financialHighlights.map((highlight, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="text-xl font-bold text-primary">{highlight}</div>
                  <div className="text-sm text-gray-600 mt-1">Impact Value</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Critical Findings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            🎯 Critical Findings
          </h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {intelligence?.criticalFindings?.slice(0, 3).map((finding, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-l-4 border-primary pl-4 py-2"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{getPriorityIcon(finding.priority)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{finding.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border
                        ${getRiskLevelColor(finding.priority)}`}>
                        {finding.priority}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {finding.description?.substring(0, 200)}
                      {finding.description?.length > 200 && '...'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Strategic Actions */}
      {borogueContext?.strategicActions?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              🚀 Strategic Recommendations
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {borogueContext.strategicActions.slice(0, 3).map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg border border-primary-200"
                >
                  <span className="text-primary font-bold">{index + 1}</span>
                  <p className="text-gray-700 text-sm leading-relaxed">{action}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Competitive Positioning */}
      {borogueContext?.competitivePositioning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              🏆 Competitive Positioning
            </h3>
          </div>
          <div className="card-body">
            <p className="text-gray-700 leading-relaxed">
              {borogueContext.competitivePositioning}
            </p>
            {borogueContext.competitors?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Key Competitors:</p>
                <div className="flex flex-wrap gap-2">
                  {borogueContext.competitors.map((competitor, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {competitor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ExecutiveDashboard;
