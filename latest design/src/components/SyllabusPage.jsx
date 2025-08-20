import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { sortByDateConsistent } from '../utils/dateUtils';

const SyllabusPage = () => {
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSyllabi = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('syllabus')
        .select('*');

      if (!error && data) {
        // Sort by post_time if available, otherwise by created_at (most recent first)
        const sortedSyllabi = sortByDateConsistent(data, 'post_time', 'created_at');
        setSyllabi(sortedSyllabi);
      }
      setLoading(false);
    };

    fetchSyllabi();
  }, []);

  // Filter syllabi based on search
  const filteredSyllabi = syllabi.filter(syllabus =>
    syllabus.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Syllabus</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search syllabus..."
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
      ) : filteredSyllabi.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">📚</div>
          <h3>No syllabus found</h3>
          <p>{search ? `No syllabus match "${search}"` : 'No syllabus available at the moment'}</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredSyllabi.map(syllabus => (
            <div key={syllabus.id} className="item-card">
              <Link to={`/syllabus/${syllabus.slug}`} className="item-link">
                <h3>{syllabus.title}</h3>
                <div className="item-meta">
                  <span className={`status-badge ${syllabus.status.toLowerCase()}`}>
                    {syllabus.status}
                  </span>
                  <span className="date">{new Date(syllabus.created_at).toLocaleDateString('en-GB', { 
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

export default SyllabusPage; 