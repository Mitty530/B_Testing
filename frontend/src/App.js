import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchInterface from './components/SearchInterface';
import ResultsDisplay from './components/ResultsDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);

  // Load API status on component mount
  useEffect(() => {
    fetchApiStatus();
  }, []);

  const fetchApiStatus = async () => {
    try {
      const response = await fetch('/api/esg-intelligence/status');
      if (response.ok) {
        const data = await response.json();
        setApiStatus(data);
      }
    } catch (err) {
      console.warn('Failed to fetch API status:', err);
    }
  };

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setSearchResults(null);

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

      setSearchResults(data);
      await fetchApiStatus(); // Update API status after request

    } catch (err) {
      console.error('Search error:', err);
      setError({
        message: err.message,
        suggestions: err.suggestions || []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearResults = () => {
    setSearchResults(null);
    setError(null);
  };

  return (
    <ErrorBoundary>
      <div className="App min-h-screen bg-gray-50">
        <Header apiStatus={apiStatus} />
        
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SearchInterface
              onSearch={handleSearch}
              isLoading={isLoading}
              apiStatus={apiStatus}
              onClear={handleClearResults}
              hasResults={!!searchResults}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingSpinner />
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <div className="card bg-red-50 border border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="text-red-600 text-xl">⚠️</div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-800 mb-2">
                        Analysis Error
                      </h3>
                      <p className="text-red-700 mb-4">{error.message}</p>
                      
                      {error.suggestions && error.suggestions.length > 0 && (
                        <div>
                          <p className="text-red-700 font-medium mb-2">
                            Try these ESG-related queries:
                          </p>
                          <ul className="list-disc list-inside text-red-600 space-y-1">
                            {error.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-sm">{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {searchResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <ResultsDisplay results={searchResults} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
