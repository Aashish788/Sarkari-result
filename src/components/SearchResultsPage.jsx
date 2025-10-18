import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { globalSearch, SEARCH_CATEGORIES } from '../services/searchService';
import SearchBox from './SearchBox';

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const [categorizedResults, setCategorizedResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [totalFound, setTotalFound] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search query from URL
  const getSearchQuery = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('q') || '';
  };

  const [query, setQuery] = useState(getSearchQuery());

  // Handle search
  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setCategorizedResults({});
      setTotalFound(0);
      return;
    }

    setLoading(true);
    
    try {
      const categories = selectedCategory === 'all' ? null : [selectedCategory];
      const searchResults = await globalSearch(searchQuery, categories, 100);
      
      setResults(searchResults.results || []);
      setCategorizedResults(searchResults.categorizedResults || {});
      setTotalFound(searchResults.totalFound || 0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setCategorizedResults({});
      setTotalFound(0);
    } finally {
      setLoading(false);
    }
  };

  // Update search when URL changes
  useEffect(() => {
    const searchQuery = getSearchQuery();
    setQuery(searchQuery);
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [location.search, selectedCategory]);

  // Handle search input
  const handleSearchInput = (searchQuery) => {
    setQuery(searchQuery);
    
    // Update URL
    const urlParams = new URLSearchParams();
    if (searchQuery.trim()) {
      urlParams.set('q', searchQuery.trim());
    }
    if (selectedCategory !== 'all') {
      urlParams.set('category', selectedCategory);
    }
    
    const newUrl = `/search${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    navigate(newUrl, { replace: true });
  };

  // Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    const urlParams = new URLSearchParams(location.search);
    if (category !== 'all') {
      urlParams.set('category', category);
    } else {
      urlParams.delete('category');
    }
    
    const newUrl = `/search${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    navigate(newUrl, { replace: true });
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Search Results</h1>
      
      {/* Search Input */}
      <div className="search-container">
        <SearchBox 
          variant="desktop"
          placeholder="Search across all categories..."
          className="search-page-input"
          showTrending={!query}
          onResultSelect={(result) => {
            navigate(result.route);
          }}
        />
      </div>

      {/* Category Filters */}
      <div className="search-filters">
        <button 
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('all')}
        >
          All ({totalFound})
        </button>
        {Object.entries(SEARCH_CATEGORIES)
          .sort(([, a], [, b]) => (a.priority || 999) - (b.priority || 999))
          .map(([key, category]) => {
            const count = categorizedResults[key]?.length || 0;
            return (
              <button 
                key={key}
                className={`filter-btn ${selectedCategory === key ? 'active' : ''}`}
                onClick={() => handleCategoryChange(key)}
                disabled={count === 0}
              >
                {category.icon} {category.label} ({count})
              </button>
            );
          })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="search-loading-state">
          <div className="search-spinner"></div>
          <p>Searching...</p>
        </div>
      )}

      {/* Search Results */}
      {!loading && query && (
        <>
          {results.length === 0 ? (
            <div className="no-search-results">
              <div className="no-results-icon">🔍</div>
              <h3>No results found</h3>
              <p>No results found for "{query}"{selectedCategory !== 'all' ? ` in ${SEARCH_CATEGORIES[selectedCategory]?.label}` : ''}</p>
              <div className="search-suggestions">
                <h4>Try:</h4>
                <ul>
                  <li>Different keywords</li>
                  <li>More general terms</li>
                  <li>Checking spelling</li>
                  <li>Browsing different categories</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="search-results-container">
              <div className="search-results-header">
                <h2>
                  {totalFound} result{totalFound !== 1 ? 's' : ''} for "{query}"
                  {selectedCategory !== 'all' && ` in ${SEARCH_CATEGORIES[selectedCategory]?.label}`}
                </h2>
              </div>
              
              <div className="search-results-grid">
                {results.map((result) => (
                  <div key={`${result.category}-${result.id}`} className="search-result-card">
                    <Link to={result.route} className="result-card-link">
                      <div className="result-card-header">
                        <div className="result-category-badge">
                          <span className="category-icon">{result.icon}</span>
                          <span className="category-label">{result.categoryLabel}</span>
                        </div>
                        {result.status && (
                          <span className={`result-status-badge ${result.status.toLowerCase()}`}>
                            {result.status}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="result-card-title">{result.title}</h3>
                      
                      <div className="result-card-meta">
                        <span className="result-date">
                          {formatDate(result.post_time || result.created_at)}
                        </span>
                        {result.apply_end_date && (
                          <span className="result-deadline">
                            Apply by: {formatDate(result.apply_end_date)}
                          </span>
                        )}
                        {result.exam_date && (
                          <span className="result-exam-date">
                            Exam: {formatDate(result.exam_date)}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Initial State */}
      {!loading && !query && (
        <div className="search-initial-state">
          <div className="search-welcome">
            <h2>🔍 Universal Search</h2>
            <p>Search across all categories including jobs, results, admit cards, answer keys, admissions, documents, and syllabus.</p>
            
            {/* Rich Content for AdSense Compliance */}
            <div className="search-description">
              <h3>How to Use Search</h3>
              <p>
                Our advanced search feature allows you to quickly find relevant government job 
                notifications, exam results, admit cards, answer keys, admission notices, and important 
                documents. Simply enter keywords related to what you're looking for in the search box above.
              </p>
              
              <h3>Search Tips</h3>
              <ul>
                <li><strong>Use Specific Keywords:</strong> Try searching for specific exam names, department names, or post titles for better results.</li>
                <li><strong>Filter by Category:</strong> Use the category filters below to narrow down your search to specific types of content.</li>
                <li><strong>Check Spelling:</strong> Make sure your keywords are spelled correctly for accurate results.</li>
                <li><strong>Try Different Terms:</strong> If you don't find what you're looking for, try using synonyms or related terms.</li>
              </ul>

              <h3>What You Can Find</h3>
              <p>
                Our database contains thousands of entries covering all major government recruitment 
                notifications, exam results, admit cards, and more. Whether you're looking for central 
                government jobs, state government positions, public sector undertakings (PSUs), banking 
                jobs, railway recruitment, defense services, or any other government opportunity, you'll 
                find comprehensive information here.
              </p>

              <h3>Popular Searches</h3>
              <p>
                Some of the most searched categories include: SSC (Staff Selection Commission), UPSC 
                (Union Public Service Commission), Railway Recruitment, Banking Exams, Police Recruitment, 
                Teaching Jobs, Medical & Healthcare Jobs, Engineering Jobs, and State Public Service 
                Commissions. We update our database daily with the latest notifications and results.
              </p>

              <h3>Stay Updated</h3>
              <p>
                Bookmark this page and visit regularly to stay updated with the latest government job 
                opportunities. You can also enable push notifications to receive instant alerts about 
                new job postings, results, and admit cards relevant to your interests.
              </p>
            </div>
          </div>
          
          <div className="search-categories-grid">
            {Object.entries(SEARCH_CATEGORIES)
              .sort(([, a], [, b]) => (a.priority || 999) - (b.priority || 999))
              .map(([key, category]) => (
                <Link 
                  key={key}
                  to={category.route}
                  className="search-category-card"
                >
                  <div className="category-icon-large">{category.icon}</div>
                  <h3>{category.label}</h3>
                  <p>Browse all {category.label.toLowerCase()}</p>
                  <p className="category-description">
                    {key === 'jobs' && 'Latest government job notifications and recruitment updates'}
                    {key === 'results' && 'Exam results, merit lists, and scorecard information'}
                    {key === 'admit_cards' && 'Download hall tickets and call letters for exams'}
                    {key === 'answer_keys' && 'Official answer keys and solution papers'}
                    {key === 'admissions' && 'College and university admission notifications'}
                    {key === 'documents' && 'Important forms, certificates, and documentation'}
                    {key === 'syllabus' && 'Exam syllabus, pattern, and preparation materials'}
                  </p>
                </Link>
              ))}
          </div>

          <div className="search-features">
            <h3>Why Use Our Search?</h3>
            <div className="features-grid">
              <div className="feature-item">
                <h4>⚡ Fast & Accurate</h4>
                <p>Get instant search results with high accuracy from our comprehensive database.</p>
              </div>
              <div className="feature-item">
                <h4>📱 Mobile Friendly</h4>
                <p>Search seamlessly on any device - desktop, tablet, or mobile phone.</p>
              </div>
              <div className="feature-item">
                <h4>🔄 Always Updated</h4>
                <p>Our database is updated daily with the latest information.</p>
              </div>
              <div className="feature-item">
                <h4>🎯 Smart Filters</h4>
                <p>Filter results by category to find exactly what you need.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
