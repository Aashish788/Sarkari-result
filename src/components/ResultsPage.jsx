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
      <h1 className="page-title">Latest Government Exam Results {new Date().getFullYear()}</h1>
      
      {/* Rich Content for AdSense Compliance */}
      <div className="page-introduction">
        <p>
          Check the latest Sarkari Result updates for various government examinations conducted 
          across India. This page provides comprehensive information about exam results, merit lists, 
          cut-off marks, scorecards, and selection lists for all major government recruitments including 
          SSC, UPSC, Railway, Banking, State PSC, Police, Teaching, and other competitive examinations.
        </p>
        <p>
          We understand how important exam results are for candidates who have appeared in government 
          exams. That's why we ensure to provide accurate and timely updates as soon as results are 
          declared by the respective organizations. Each result listing includes complete information 
          about how to check results, download scorecards, and understand the selection process.
        </p>
        <p>
          <strong>How to Check Results:</strong> Click on the relevant result card below to get 
          detailed information. You'll find direct links to official result pages, instructions for 
          downloading scorecards, information about cut-off marks, and next steps in the selection 
          process. Bookmark this page to stay updated with result announcements.
        </p>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search results by exam name, department, or organization..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
          aria-label="Search exam results"
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
          <div className="no-results-help">
            <h4>What to do next:</h4>
            <ul>
              <li>Try searching with different keywords or exam names</li>
              <li>Check the official website of the exam conducting body</li>
              <li>Visit our jobs section to find new recruitment opportunities</li>
              <li>Enable notifications to get instant result updates</li>
            </ul>
            <p>
              Results are published as soon as they are declared by the respective organizations. 
              We update this page multiple times daily to ensure you get the latest information. 
              Please check back regularly or subscribe to our push notifications for instant updates.
            </p>
          </div>
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