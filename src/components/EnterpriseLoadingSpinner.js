import React from 'react';
import { motion } from 'framer-motion';
import { Brain, BarChart3, Globe, Zap } from 'lucide-react';

const EnterpriseLoadingSpinner = ({ stage = 'analyzing', progress = 0 }) => {
  const stages = [
    { 
      id: 'analyzing', 
      label: 'Analyzing Query', 
      icon: Brain,
      description: 'Processing your strategic intelligence request...'
    },
    { 
      id: 'searching', 
      label: 'Gathering Intelligence', 
      icon: Globe,
      description: 'Searching global news sources and databases...'
    },
    { 
      id: 'processing', 
      label: 'AI Processing', 
      icon: Zap,
      description: 'Applying advanced AI analysis and insights...'
    },
    { 
      id: 'generating', 
      label: 'Generating Report', 
      icon: BarChart3,
      description: 'Compiling comprehensive strategic intelligence...'
    }
  ];

  const currentStage = stages.find(s => s.id === stage) || stages[0];
  const CurrentIcon = currentStage.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Main Loading Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Animated Icon Container */}
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 mx-auto relative"
            >
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              
              {/* Progress Ring */}
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * progress) / 100}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
              
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <CurrentIcon className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stage Information */}
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {currentStage.label}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {currentStage.description}
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative overflow-hidden"
              >
                <motion.div
                  animate={{ x: ['0%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
            
            <p className="text-sm text-gray-500 font-medium">
              {progress}% Complete
            </p>
          </motion.div>

          {/* Stage Indicators */}
          <div className="flex justify-center space-x-4 mb-8">
            {stages.map((stageItem, index) => {
              const StageIcon = stageItem.icon;
              const isActive = stageItem.id === stage;
              const isCompleted = stages.findIndex(s => s.id === stage) > index;
              
              return (
                <motion.div
                  key={stageItem.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex flex-col items-center space-y-2 ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-100 scale-110' 
                      : isCompleted 
                        ? 'bg-green-100' 
                        : 'bg-gray-100'
                  }`}>
                    <StageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-center max-w-16">
                    {stageItem.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Estimated Time */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card p-6 inline-block"
          >
            <div className="flex items-center space-x-3 text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Estimated completion: {Math.max(5 - Math.floor(progress / 20), 1)} seconds
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -100],
                x: [0, Math.random() * 200 - 100]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut"
              }}
              className="absolute top-3/4 left-1/2 w-2 h-2 bg-blue-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Skeleton Loading Component for Results
export const SkeletonLoader = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="premium-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded-lg w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
        </div>
        
        {/* Tabs Skeleton */}
        <div className="flex space-x-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-lg w-32"></div>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="premium-card p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnterpriseLoadingSpinner;
