import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const EnterpriseSearchInterface = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef(null);

  // Removed intelligenceTypes as the section was removed

  const quickQueries = useMemo(() => [
    'CBAM carbon border adjustment impact on petrochemicals',
    'SABIC petrochemical expansion strategy Middle East',
    'EU circular economy directive compliance requirements',
    'Asian polyethylene market forecast 2024-2025',
    'Carbon pricing mechanisms chemical industry',
    'Sustainable packaging regulations global overview'
  ], []);

  // Removed features array as the section was removed

  useEffect(() => {
    if (query.length > 2) {
      const filtered = quickQueries.filter(q =>
        q.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 4));
    } else {
      setSuggestions([]);
    }
  }, [query, quickQueries]);

  const handleSearch = () => {
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        handleQuickQuery(suggestions[selectedSuggestion]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Escape') {
      setIsActive(false);
      setSuggestions([]);
      setSelectedSuggestion(-1);
    }
  };

  const handleQuickQuery = (selectedQuery) => {
    setQuery(selectedQuery);
    onSearch(selectedQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 border-b border-white/20 backdrop-blur-sm bg-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Borouge Intelligence</h1>
                <p className="text-sm text-gray-600">Enterprise Strategic Research Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-8 text-sm">
              <div className="status-indicator online">
                <div className="status-dot online"></div>
                <span>System Online</span>
              </div>
              <div className="text-gray-500">
                <span className="font-medium text-gray-700">47</span> of 50 queries today
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center pt-20 lg:pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-3 glass-card px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-semibold">AI-Powered Strategic Intelligence</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
              Research that drives
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                strategic decisions
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed">
              Get instant access to petrochemical industry insights, competitive analysis, 
              and regulatory intelligence tailored for Borouge's strategic objectives.
            </p>
          </motion.div>

          {/* Large Search Interface - Similar to uploaded image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mb-16"
          >
            {/* Main Search Bar - Large and Prominent */}
            <div className="max-w-6xl mx-auto">
              <div className={`relative bg-white rounded-3xl border-2 transition-all duration-300 shadow-2xl ${
                isActive ? 'border-blue-500 shadow-blue-100 scale-[1.01]' : 'border-gray-200 hover:border-gray-300'
              }`} style={{ minHeight: '80px' }}>
                <div className="flex items-center px-10 py-8">
                  <Search className={`w-8 h-8 mr-8 transition-colors duration-300 ${
                    isActive || query ? 'text-blue-600' : 'text-gray-400'
                  }`} />

                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedSuggestion(-1);
                    }}
                    onFocus={() => setIsActive(true)}
                    onBlur={() => setTimeout(() => setIsActive(false), 200)}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter your strategic research query..."
                    className="flex-1 text-2xl text-gray-800 placeholder-gray-400 border-none outline-none bg-transparent font-medium leading-relaxed"
                    disabled={isLoading}
                    style={{ fontSize: '22px', lineHeight: '1.4' }}
                  />

                  {query && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleSearch}
                      disabled={isLoading}
                      className="ml-8 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 text-lg"
                    >
                      <span>{isLoading ? 'Analyzing...' : 'Research'}</span>
                      <ArrowRight className="w-6 h-6" />
                    </motion.button>
                  )}
                </div>

                {/* Inline Suggestions Dropdown */}
                <AnimatePresence>
                  {suggestions.length > 0 && isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-100 bg-gray-50 rounded-b-3xl overflow-hidden"
                    >
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleQuickQuery(suggestion)}
                          className={`w-full text-left px-8 py-4 transition-all duration-200 flex items-center space-x-4 ${
                            index === selectedSuggestion
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700 hover:bg-white'
                          } ${index === suggestions.length - 1 ? 'rounded-b-3xl' : 'border-b border-gray-200'}`}
                          whileHover={{ x: 4 }}
                          disabled={isLoading}
                        >
                          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-base font-medium">{suggestion}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Quick Query Suggestions Below Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-6xl mx-auto mb-20"
          >
            <div className="flex flex-wrap justify-center gap-4">
              {quickQueries.slice(0, 6).map((queryItem, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleQuickQuery(queryItem)}
                  disabled={isLoading}
                  className="px-8 py-4 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-3xl text-gray-700 hover:text-blue-700 font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm hover:bg-blue-50"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {queryItem.length > 45 ? queryItem.substring(0, 42) + '...' : queryItem}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Clean end after suggestion pills - minimal focused interface */}
        </div>
      </main>
    </div>
  );
};

export default EnterpriseSearchInterface;
