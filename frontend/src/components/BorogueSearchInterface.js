import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Shield, TrendingUp, Globe } from 'lucide-react';

const BorogueSearchInterface = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const intelligenceTypes = [
    { label: 'Regulatory Intelligence', icon: Shield, desc: 'CBAM, REACH, compliance analysis' },
    { label: 'Competitive Analysis', icon: TrendingUp, desc: 'SABIC, Dow, market positioning' },
    { label: 'ESG & Sustainability', icon: Globe, desc: 'Carbon footprint, circular economy' }
  ];

  const quickQueries = [
    'CBAM carbon border adjustment impact',
    'SABIC petrochemical expansion strategy',
    'EU circular economy directive compliance',
    'Asian polyethylene market forecast'
  ];

  useEffect(() => {
    if (query.length > 2) {
      const filtered = quickQueries.filter(q =>
        q.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 3));
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
      handleSearch();
    }
  };

  const handleQuickQuery = (selectedQuery) => {
    setQuery(selectedQuery);
    onSearch(selectedQuery);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-900 to-slate-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Borouge Intelligence</h1>
                <p className="text-sm text-gray-500">Strategic Research Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Online</span>
              </div>
              <span className="text-gray-400">47 of 50 queries today</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8">
        {/* Hero Section */}
        <div className="text-center pt-20 pb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Strategic Intelligence</span>
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Research that drives
            <br />
            <span className="text-blue-600">strategic decisions</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get instant access to petrochemical industry insights, competitive analysis, 
            and regulatory intelligence tailored for Borouge's strategic objectives.
          </p>

          {/* Search Interface */}
          <div className="relative mb-12">
            <div className={`relative bg-white rounded-2xl shadow-xl border transition-all duration-300 ${
              isActive ? 'border-blue-300 shadow-2xl scale-[1.02]' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex items-center p-6">
                <Search className="w-6 h-6 text-gray-400 mr-4 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsActive(true)}
                  onBlur={() => setTimeout(() => setIsActive(false), 200)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your research query..."
                  className="flex-1 text-lg text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
                  disabled={isLoading}
                />
                {query && (
                  <button 
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="ml-4 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Researching...' : 'Research'}
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && isActive && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-2xl mt-2 z-10 overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuery(suggestion)}
                      className="w-full text-left px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                      disabled={isLoading}
                    >
                      <div className="flex items-center">
                        <Search className="w-4 h-4 text-gray-400 mr-3" />
                        <span>{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Intelligence Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {intelligenceTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickQuery(type.desc.split(',')[0])}
                  disabled={isLoading}
                  className="group p-8 bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-2xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-xl mb-4 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all duration-300">
                      <Icon className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.label}</h3>
                    <p className="text-sm text-gray-600">{type.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Queries */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Research Queries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickQueries.map((queryItem, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuery(queryItem)}
                  disabled={isLoading}
                  className="text-left p-4 bg-white border border-gray-200 hover:border-blue-200 rounded-xl transition-all duration-200 hover:shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center mr-3 transition-colors">
                      <Search className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                      {queryItem}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>AI Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Strategic Intelligence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BorogueSearchInterface;
