import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { sortByDateConsistent } from '../utils/dateUtils';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('results')
        .select('*');

      if (!error && data) {
        // Sort by post_time if available, otherwise by created_at (most recent first)
        const sortedResults = sortByDateConsistent(data, 'post_time', 'created_at');
        setResults(sortedResults);
      }
      setLoading(false);
    };

    fetchResults();
  }, []);

  // Filter results based on search
  const filteredResults = results.filter(result =>
    result.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Results</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search results..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading-skeleton">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="skeleton-item" />
          ))}
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">📊</div>
          <h3>No results found</h3>
          <p>{search ? `No results match "${search}"` : 'No results available at the moment'}</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredResults.map(result => (
            <div key={result.id} className="item-card">
              <Link to={`/results/${result.slug}`} className="item-link">
                <h3>{result.title}</h3>
                <div className="item-meta">
                  <span className={`status-badge ${result.status.toLowerCase()}`}>
                    {result.status}
                  </span>
                  <span className="date">{new Date(result.created_at).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short' 
                  })}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage; 