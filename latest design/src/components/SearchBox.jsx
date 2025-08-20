import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { globalSearch, getSearchSuggestions, getTrendingSearches } from '../services/searchService';
import './SearchBox.css';

const SearchBox = ({ 
  className = '', 
  placeholder = 'Search jobs, results, admit cards...', 
  onResultSelect,
  showTrending = true,
  variant = 'desktop' // 'desktop' or 'mobile'
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const searchResults = await globalSearch(searchQuery, null, 20);
        setResults(searchResults.results || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim().length >= 2) {
      setLoading(true);
      debouncedSearch(value);
      
      // Get suggestions
      getSearchSuggestions(value, 5).then(setSuggestions);
    } else {
      setResults([]);
      setSuggestions([]);
      setLoading(false);
    }
  };

  // Handle search focus
  const handleFocus = () => {
    setIsOpen(true);
    if (query.trim().length === 0 && showTrending) {
      // Load trending searches when focused with empty query
      getTrendingSearches(8).then(setTrending);
    }
  };

  // Handle result selection
  const handleResultSelect = (result) => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setSuggestions([]);
    
    if (onResultSelect) {
      onResultSelect(result);
    } else {
      navigate(result.route);
    }
  };

  // Handle suggestion select
  const handleSuggestionSelect = (suggestion) => {
    setQuery(suggestion.text);
    inputRef.current?.focus();
    setLoading(true);
    debouncedSearch(suggestion.text);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const totalItems = results.length + suggestions.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < totalItems - 1 ? prev + 1 : -1
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > -1 ? prev - 1 : totalItems - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < suggestions.length) {
            handleSuggestionSelect(suggestions[selectedIndex]);
          } else {
            handleResultSelect(results[selectedIndex - suggestions.length]);
          }
        } else if (query.trim()) {
          // Navigate to search page with search query
          navigate(`/search?q=${encodeURIComponent(query.trim())}`);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short' 
      });
    } catch {
      return '';
    }
  };

  const showDropdown = isOpen && (
    results.length > 0 || 
    suggestions.length > 0 || 
    loading || 
    (query.trim().length === 0 && trending.length > 0 && showTrending)
  );

  return (
    <div 
      ref={searchRef} 
      className={`search-box-container ${className} ${variant}`}
    >
      <form onSubmit={handleSubmit} className="search-form">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={variant === 'mobile' ? 'mobile-search-input' : 'nav-search-input'}
          autoComplete="off"
        />
        <button 
          type="submit"
          className={variant === 'mobile' ? 'mobile-search-btn' : 'nav-search-btn'}
          disabled={!query.trim()}
        >
          🔍
        </button>
      </form>

      {showDropdown && (
        <div 
          ref={dropdownRef}
          className={`search-dropdown ${variant}`}
        >
          {loading && (
            <div className="search-loading">
              <div className="search-spinner"></div>
              <span>Searching...</span>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && !loading && (
            <div className="search-section">
              <div className="search-section-title">Suggestions</div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={`suggestion-${index}`}
                  className={`search-suggestion ${selectedIndex === index ? 'selected' : ''}`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <span className="suggestion-icon">{suggestion.icon}</span>
                  <span className="suggestion-text">{suggestion.text}</span>
                  <span className="suggestion-category">{suggestion.category}</span>
                </div>
              ))}
            </div>
          )}

          {/* Search Results */}
          {results.length > 0 && !loading && (
            <div className="search-section">
              <div className="search-section-title">
                Results ({results.length})
              </div>
              {results.map((result, index) => {
                const adjustedIndex = index + suggestions.length;
                return (
                  <div
                    key={`result-${result.id}`}
                    className={`search-result ${selectedIndex === adjustedIndex ? 'selected' : ''}`}
                    onClick={() => handleResultSelect(result)}
                  >
                    <div className="result-icon">{result.icon}</div>
                    <div className="result-content">
                      <div className="result-title">{result.title}</div>
                      <div className="result-meta">
                        <span className="result-category">{result.categoryLabel}</span>
                        {result.status && (
                          <span className={`result-status ${result.status.toLowerCase()}`}>
                            {result.status}
                          </span>
                        )}
                        <span className="result-date">
                          {formatDate(result.post_time || result.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Trending searches when no query */}
          {query.trim().length === 0 && trending.length > 0 && showTrending && !loading && (
            <div className="search-section">
              <div className="search-section-title">Trending</div>
              {trending.map((item) => (
                <div
                  key={`trending-${item.category}-${item.slug}`}
                  className="search-result trending"
                  onClick={() => navigate(item.route)}
                >
                  <div className="result-icon">{item.icon}</div>
                  <div className="result-content">
                    <div className="result-title">{item.title}</div>
                    <div className="result-meta">
                      <span className="result-category">{item.category}</span>
                      <span className="result-date">
                        {formatDate(item.post_time || item.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div className="search-no-results">
              <div className="no-results-icon">🔍</div>
              <div className="no-results-text">
                No results found for "{query}"
              </div>
              <div className="no-results-suggestion">
                Try different keywords or browse categories
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default SearchBox;
