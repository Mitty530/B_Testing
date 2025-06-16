import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedSearchInterface = ({ onSearch, isLoading, onClear, hasResults }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);

  const esgSuggestions = [
    'carbon emissions petrochemical industry',
    'ESG regulations chemical companies',
    'sustainability initiatives polymer industry',
    'environmental compliance UAE petrochemicals',
    'circular economy plastic recycling',
    'renewable energy chemical manufacturing',
    'carbon footprint reduction strategies',
    'ESG reporting standards chemicals',
    'sustainable packaging materials',
    'green chemistry innovations',
    'climate risk assessment petrochemicals',
    'biodiversity impact chemical industry'
  ];

  const filteredSuggestions = esgSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase()) && query.length > 2
  );

  // Listen for suggestion fill events
  useEffect(() => {
    const handleFillSuggestion = (event) => {
      setQuery(event.detail);
      onSearch(event.detail);
    };

    window.addEventListener('fillSuggestion', handleFillSuggestion);
    return () => window.removeEventListener('fillSuggestion', handleFillSuggestion);
  }, [onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        if (selectedSuggestion >= 0) {
          e.preventDefault();
          handleSuggestionClick(filteredSuggestions[selectedSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Clean Header - inspired by reference image */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-medium text-gray-900 mb-2 leading-tight tracking-tight">
          What can I help you analyze?
        </h1>
        <p className="text-lg text-gray-600 font-normal">
          ESG Intelligence for Borouge
        </p>
      </motion.div>

      {/* Clean Search Form - inspired by reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 focus-within:border-blue-500 focus-within:shadow-lg">
            {/* Search Icon */}
            <div className="absolute left-5 flex items-center pointer-events-none">
              <svg
                className={`w-5 h-5 transition-colors duration-200 ${
                  isTyping || query ? 'text-blue-500' : 'text-gray-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsTyping(e.target.value.length > 0);
                setShowSuggestions(e.target.value.length > 2);
                setSelectedSuggestion(-1);
              }}
              onFocus={() => {
                setIsTyping(true);
                setShowSuggestions(query.length > 2);
              }}
              onBlur={() => {
                setIsTyping(false);
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              onKeyDown={handleKeyDown}
              placeholder="ESG trends, regulations, sustainability initiatives..."
              className="flex-1 pl-14 pr-20 py-5 text-lg border-0 rounded-2xl
                       focus:ring-0 focus:outline-none
                       placeholder-gray-500 bg-transparent font-normal"
              disabled={isLoading}
            />

            {/* Submit Button */}
            <div className="absolute right-3">
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-xl
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 flex items-center justify-center
                         shadow-sm hover:shadow-md"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200
                       rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
            >
              {filteredSuggestions.slice(0, 6).map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors
                           ${index === selectedSuggestion ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                           ${index === 0 ? 'rounded-t-xl' : ''}
                           ${index === filteredSuggestions.slice(0, 6).length - 1 ? 'rounded-b-xl' : ''}`}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm">{suggestion}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Action Tags - Clean and minimal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12"
      >
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {[
            'ESG in petrochemicals',
            'Carbon footprint analysis',
            'Sustainability reporting',
            'Circular economy',
            'Environmental compliance',
            'Renewable energy'
          ].map((tag, index) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                onSearch(tag);
              }}
              className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100
                       rounded-full transition-all duration-200 text-sm border border-gray-200
                       hover:border-gray-300"
              disabled={isLoading}
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedSearchInterface;
