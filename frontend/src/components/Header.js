import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Database } from 'lucide-react';

const Header = ({ apiStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-orange-600';
      case 'unhealthy': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return '🟢';
      case 'degraded': return '🟡';
      case 'unhealthy': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-sm border-b border-gray-200"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Borouge ESG Intelligence
              </h1>
              <p className="text-sm text-gray-600">
                Strategic research intelligence for the petrochemical industry
              </p>
            </div>
          </div>

          {/* API Status */}
          {apiStatus && (
            <div className="flex items-center gap-6">
              {/* System Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">System Status:</span>
                <span className={`text-sm font-semibold ${getStatusColor('healthy')}`}>
                  {getStatusIcon('healthy')} Operational
                </span>
              </div>

              {/* API Usage */}
              <div className="flex items-center gap-4 text-sm">
                {/* Gemini API */}
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">AI:</span>
                  <span className="font-medium text-gray-900">
                    {apiStatus.services?.gemini?.remainingRequests || 0}/{apiStatus.services?.gemini?.dailyLimit || 50}
                  </span>
                </div>

                {/* News API */}
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">News:</span>
                  <span className="font-medium text-gray-900">
                    {apiStatus.services?.newsapi?.remainingRequests || 0}/{apiStatus.services?.newsapi?.dailyLimit || 100}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
