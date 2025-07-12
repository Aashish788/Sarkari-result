import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { sortByDateConsistent } from '../utils/dateUtils';

const AdmissionsPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAdmissions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('admissions')
        .select('*');

      if (!error && data) {
        // Sort by post_time if available, otherwise by created_at (most recent first)
        const sortedAdmissions = sortByDateConsistent(data, 'post_time', 'created_at');
        setAdmissions(sortedAdmissions);
      }
      setLoading(false);
    };

    fetchAdmissions();
  }, []);

  // Filter admissions based on search
  const filteredAdmissions = admissions.filter(admission =>
    admission.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Admissions</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search admissions..."
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
      ) : filteredAdmissions.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🎓</div>
          <h3>No admissions found</h3>
          <p>{search ? `No admissions match "${search}"` : 'No admissions available at the moment'}</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredAdmissions.map(admission => (
            <div key={admission.id} className="item-card">
              <Link to={`/admissions/${admission.slug}`} className="item-link">
                <h3>{admission.title}</h3>
                <div className="item-meta">
                  <span className={`status-badge ${admission.status.toLowerCase()}`}>
                    {admission.status}
                  </span>
                  <span className="date">{new Date(admission.created_at).toLocaleDateString('en-GB', { 
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

export default AdmissionsPage; 