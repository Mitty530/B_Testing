import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const quickQueries = [
  'CBAM carbon border adjustment impact on petrochemicals',
  'SABIC petrochemical expansion strategy Middle East',
  'EU circular economy directive compliance requirements',
  'Asian polyethylene market forecast 2024-2025',
  'Carbon pricing mechanisms chemical industry',
  'Sustainable packaging regulations global overview'
];

const EnterpriseSearchInterface = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 2) {
      const filtered = quickQueries.filter(q =>
        q.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 4));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = () => {
    if (query.trim() && !isLoading) {
      // Navigate to results page with query
      navigate(`/research/${encodeURIComponent(query.trim())}`);
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
    // Navigate to results page with selected quick query
    navigate(`/research/${encodeURIComponent(selectedQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* ...existing code... */}
      {/* Main Search Bar */}
      {/* ...existing code... */}
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

      {/* ...existing code... */}

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
      {/* ...existing code... */}
    </div>
  );
};

export default EnterpriseSearchInterface;