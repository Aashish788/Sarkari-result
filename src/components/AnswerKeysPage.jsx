import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { sortByDateConsistent } from '../utils/dateUtils';

const AnswerKeysPage = () => {
  const [answerKeys, setAnswerKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAnswerKeys = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('answer_keys')
        .select('*');

      if (!error && data) {
        // Sort by post_time if available, otherwise by created_at (most recent first)
        const sortedAnswerKeys = sortByDateConsistent(data, 'post_time', 'created_at');
        setAnswerKeys(sortedAnswerKeys);
      }
      setLoading(false);
    };

    fetchAnswerKeys();
  }, []);

  // Filter answer keys based on search
  const filteredAnswerKeys = answerKeys.filter(key =>
    key.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Answer Keys</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search answer keys..."
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
      ) : filteredAnswerKeys.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔑</div>
          <h3>No answer keys found</h3>
          <p>{search ? `No answer keys match "${search}"` : 'No answer keys available at the moment'}</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredAnswerKeys.map(key => (
            <div key={key.id} className="item-card">
              <Link to={`/answer-keys/${key.slug}`} className="item-link">
                <h3>{key.title}</h3>
                <div className="item-meta">
                  <span className={`status-badge ${key.status.toLowerCase()}`}>
                    {key.status}
                  </span>
                  <span className="date">{new Date(key.created_at).toLocaleDateString('en-GB', { 
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

export default AnswerKeysPage; 