import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Search, BarChart3, FileText } from 'lucide-react';

const LoadingSpinner = () => {
  const steps = [
    { icon: Search, label: 'Searching industry sources', delay: 0 },
    { icon: FileText, label: 'Analyzing news articles', delay: 0.5 },
    { icon: Brain, label: 'Generating AI insights', delay: 1 },
    { icon: BarChart3, label: 'Preparing strategic analysis', delay: 1.5 }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card bg-white text-center"
      >
        {/* Main Spinner */}
        <div className="mb-8">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <motion.div
              className="absolute inset-0 border-4 border-blue-200 rounded-full"
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-2 border-4 border-blue-500 rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-4 bg-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Processing ESG Intelligence
          </h3>
          <p className="text-gray-600">
            Analyzing industry data and generating strategic insights...
          </p>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: step.delay }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: step.delay 
                  }}
                  className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <Icon className="w-4 h-4 text-blue-600" />
                </motion.div>
                
                <span className="text-gray-700 font-medium">{step.label}</span>
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, delay: step.delay }}
                  className="flex-1 h-1 bg-blue-200 rounded-full overflow-hidden ml-auto max-w-20"
                >
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: step.delay,
                      ease: "easeInOut"
                    }}
                    className="h-full w-1/2 bg-blue-500 rounded-full"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Estimated Time */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="mt-6 text-sm text-gray-500"
        >
          <p>Estimated processing time: 10-30 seconds</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
