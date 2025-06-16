import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import EnterpriseSearchInterface from './components/EnterpriseSearchInterface';
import EnterpriseResultsDisplay from './components/EnterpriseResultsDisplay';
import EnterpriseLoadingSpinner from './components/EnterpriseLoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import './styles/design-system.css';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [loadingStage, setLoadingStage] = useState('analyzing');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Clean up any previous results when component mounts
  useEffect(() => {
    // Component initialization - no API status needed for production
  }, []);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setSearchResults(null);
    setShowLandingPage(false); // Hide landing page when search starts
    setLoadingStage('analyzing');
    setLoadingProgress(0);

    // Simulate progressive loading stages
    const progressStages = [
      { stage: 'analyzing', progress: 25, delay: 500 },
      { stage: 'searching', progress: 50, delay: 1000 },
      { stage: 'processing', progress: 75, delay: 1500 },
      { stage: 'generating', progress: 90, delay: 2000 }
    ];

    // Start progress simulation
    progressStages.forEach(({ stage, progress, delay }) => {
      setTimeout(() => {
        if (isLoading) {
          setLoadingStage(stage);
          setLoadingProgress(progress);
        }
      }, delay);
    });

    try {
      const response = await fetch('/api/esg-intelligence/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          userId: '00000000-0000-0000-0000-000000000000' // Default user for MVP
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      // Complete the progress
      setLoadingProgress(100);
      setTimeout(() => {
        setSearchResults(data);
      }, 500);

    } catch (err) {
      console.error('Search error:', err);
      setError({
        message: err.message,
        suggestions: err.suggestions || []
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 500);
    }
  };

  const handleClearResults = () => {
    setSearchResults(null);
    setError(null);
    setShowLandingPage(true); // Show landing page again when clearing results
  };

  return (
    <ErrorBoundary>
      {showLandingPage ? (
        // Enterprise Landing Page
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <EnterpriseSearchInterface
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </motion.div>
      ) : isLoading ? (
        // Advanced Loading Screen
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <EnterpriseLoadingSpinner
            stage={loadingStage}
            progress={loadingProgress}
          />
        </motion.div>
      ) : searchResults ? (
        // Enterprise Results Display
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <EnterpriseResultsDisplay
            results={searchResults}
            onBack={handleClearResults}
          />
        </motion.div>
      ) : error ? (
        // Error State
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="premium-card p-12 max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Unable to Process Request
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">{error.message}</p>

            {error.suggestions && error.suggestions.length > 0 && (
              <div className="glass-card p-6 mb-8">
                <p className="text-gray-700 font-medium mb-4">
                  Try these ESG-related queries:
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {error.suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion)}
                      className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-xl
                               hover:bg-blue-200 transition-all duration-200 font-medium"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleClearResults}
              className="btn-primary-gradient px-8 py-3 rounded-xl font-semibold"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      ) : null}

      <Analytics />
    </ErrorBoundary>
  );
}

export default App;
