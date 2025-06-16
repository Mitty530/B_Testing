import React from 'react';
import { motion } from 'framer-motion';

const CleanLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main content container - clean and centered */}
      <div className="flex flex-col min-h-screen">
        {/* Content area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CleanLayout;
