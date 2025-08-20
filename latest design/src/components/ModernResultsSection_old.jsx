import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ModernResultsSection.css';

const ModernResultsSection = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to get result status based on date
  const getResultStatus = (resultDate) => {
    if (!resultDate) return { status: 'pending', text: 'Pending', color: '#ffc107' };
    
    const today = new Date();
    const result = new Date(resultDate);
    const daysSinceResult = Math.floor((today - result) / (1000 * 60 * 60 * 24));
    
    if (daysSinceResult <= 7) return { status: 'new', text: 'New Result', color: '#28a745' };
    if (daysSinceResult <= 30) return { status: 'recent', text: 'Recent', color: '#17a2b8' };
    return { status: 'older', text: 'Published', color: '#6c757d' };
  };

  // Get category icon based on exam name
  const getCategoryIcon = (title, examName) => {
    const combined = (title + ' ' + (examName || '')).toLowerCase();
    if (combined.includes('ssc') || combined.includes('staff selection')) return '🏛️';
    if (combined.includes('upsc') || combined.includes('civil') || combined.includes('ias') || combined.includes('ips')) return '👨‍💼';
    if (combined.includes('bank') || combined.includes('sbi') || combined.includes('ibps')) return '🏦';
    if (combined.includes('railway') || combined.includes('rrb')) return '🚂';
    if (combined.includes('police') || combined.includes('constable')) return '👮‍♂️';
    if (combined.includes('teacher') || combined.includes('education') || combined.includes('ctet')) return '📚';
    if (combined.includes('medical') || combined.includes('neet') || combined.includes('nurse')) return '🏥';
    if (combined.includes('engineer') || combined.includes('gate') || combined.includes('technical')) return '⚙️';
    if (combined.includes('court') || combined.includes('clerk') || combined.includes('assistant')) return '⚖️';
    return '📊';
  };

  // Get estimated candidates appeared
  const getEstimatedCandidates = (title, examName) => {
    const combined = (title + ' ' + (examName || '')).toLowerCase();
    if (combined.includes('ssc') || combined.includes('railway')) return '25L+';
    if (combined.includes('bank') || combined.includes('ibps')) return '15L+';
    if (combined.includes('upsc') || combined.includes('ias')) return '10L+';
    if (combined.includes('police') || combined.includes('constable')) return '30L+';
    if (combined.includes('teacher') || combined.includes('ctet')) return '18L+';
    return '8L+';
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      
      let query = supabase
        .from('results')
        .select('id, title, slug, exam_name, result_date, status, view_count, created_at, post_time')
        .eq('status', 'published')
        .order('result_date', { ascending: false })
        .limit(20);

      const { data, error } = await query;
      
      if (!error && data) {
        setResults(data);
      }
      
      setLoading(false);
    };

    fetchResults();

    // Auto-refresh on focus
    const handleFocus = () => fetchResults();
    const handleVisibilityChange = () => {
      if (!document.hidden) handleFocus();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Show all results without filtering
  const filteredResults = results;

  return (
    <div className="modern-results-section">
      {/* Header */}
      <div className="results-header">
        <div className="header-content">
          <h2 className="results-title">
            <span className="title-icon">📊</span>
            Latest Results
            <span className="results-count">({filteredResults.length})</span>
          </h2>
          <p className="results-subtitle">
            Fresh exam results with performance insights
          </p>
        </div>
      </div>

      {/* Filter Tabs - Removed for now */}

      {/* Results Grid */}
      <div className="results-container">
        {loading ? (
          <div className="results-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="result-card-skeleton">
                <div className="skeleton-header">
                  <div className="skeleton-icon"></div>
                  <div className="skeleton-status"></div>
                </div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-exam"></div>
                  <div className="skeleton-date"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="results-grid">
            {filteredResults.map((result) => {
              const status = getResultStatus(result.result_date);
              const categoryIcon = getCategoryIcon(result.title, result.exam_name);
              const estimatedCandidates = getEstimatedCandidates(result.title, result.exam_name);
              
              return (
                <Link
                  key={result.id}
                  to={`/results/${result.slug}`}
                  className="result-card"
                >
                  {/* Card Header */}
                  <div className="result-card-header">
                    <div className="result-icon">{categoryIcon}</div>
                    <div className="result-status-badge" style={{ backgroundColor: status.color }}>
                      {status.text}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="result-card-content">
                    <h3 className="result-title">{result.title}</h3>
                    {result.exam_name && (
                      <p className="result-exam">{result.exam_name}</p>
                    )}

                    {/* Result Metrics */}
                    <div className="result-metrics">
                      <div className="metric">
                        <span className="metric-icon">👥</span>
                        <span className="metric-label">Appeared</span>
                        <span className="metric-value">{estimatedCandidates}</span>
                      </div>
                      
                      <div className="metric">
                        <span className="metric-icon">📅</span>
                        <span className="metric-label">Result Date</span>
                        <span className="metric-value">
                          {result.result_date 
                            ? new Date(result.result_date).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short' 
                              })
                            : 'TBA'
                          }
                        </span>
                      </div>
                    </div>

                    {/* View Count */}
                    <div className="popularity-indicator">
                      <div className="popularity-bar">
                        <div 
                          className="popularity-fill"
                          style={{ 
                            width: `${Math.min((result.view_count / 5000) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="view-count">
                        {result.view_count > 1000 
                          ? `${(result.view_count / 1000).toFixed(1)}K views`
                          : `${result.view_count} views`
                        }
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="result-card-footer">
                    <div className="action-button">
                      <span>View Result</span>
                      <span className="action-arrow">→</span>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="card-shimmer"></div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* View More */}
      <div className="results-footer">
        <Link to="/results" className="view-more-results">
          <span className="more-content">
            <span className="more-icon">🎯</span>
            <span className="more-text">View All Results</span>
            <span className="more-arrow">→</span>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ModernResultsSection;
