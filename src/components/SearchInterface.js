import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, RotateCcw, AlertCircle } from 'lucide-react';

const SearchInterface = ({ onSearch, isLoading, apiStatus, onClear, hasResults }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  const isDisabled = isLoading || 
    (apiStatus?.services?.gemini?.remainingRequests <= 0) ||
    (apiStatus?.services?.newsapi?.remainingRequests <= 0);

  const exampleQueries = [
    'carbon emissions regulations petrochemical industry',
    'ESG compliance requirements chemical companies',
    'sustainability initiatives polymer manufacturing',
    'circular economy plastic recycling policies',
    'environmental regulations UAE petrochemicals'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card bg-white shadow-lg"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            The ESG Intelligence Engine
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get comprehensive ESG intelligence and strategic insights for the petrochemical industry
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <div className={`flex items-center border-2 rounded-xl transition-all duration-300 ${
              isFocused ? 'border-blue-500 shadow-lg' : 'border-gray-200'
            }`}>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your ESG research query (e.g., carbon emissions, sustainability regulations, circular economy...)"
                  className="w-full px-6 py-4 text-lg rounded-l-xl border-none focus:outline-none focus:ring-0"
                  disabled={isLoading}
                />
                
                {/* Dynamic Icon */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {isFocused ? (
                    <Sparkles className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Search className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isDisabled || !query.trim()}
                className={`px-8 py-4 rounded-r-xl font-semibold transition-all duration-300 ${
                  isDisabled || !query.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <span>Analyze</span>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* API Limits Warning */}
        {(apiStatus?.services?.gemini?.remainingRequests <= 5 || 
          apiStatus?.services?.newsapi?.remainingRequests <= 10) && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-orange-800 font-medium">API Usage Warning</p>
                <p className="text-orange-700 text-sm mt-1">
                  Daily API limits are running low. Consider upgrading for unlimited access.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Clear Results Button */}
        {hasResults && (
          <div className="mb-6 text-center">
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Clear Results & Start New Search
            </button>
          </div>
        )}

        {/* Example Queries */}
        {!hasResults && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Example ESG Intelligence Queries:
            </p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Processing Status */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-left">
              <p className="text-blue-800 font-medium">Processing ESG Intelligence</p>
              <p className="text-blue-600 text-sm">
                Searching industry sources and generating strategic analysis...
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchInterface;
