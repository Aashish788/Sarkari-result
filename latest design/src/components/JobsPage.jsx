import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { formatDateToDDMMYYYY, sortByDateConsistent } from '../utils/dateUtils';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Get search query from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      let query = supabase
        .from('jobs')
        .select('*');

      // Add search filter if search term exists
      if (search.trim()) {
        query = query.or(`title.ilike.%${search.trim()}%,post_name.ilike.%${search.trim()}%,eligibility.ilike.%${search.trim()}%`);
      }

      const { data, error } = await query;

      if (!error && data) {
        // Sort by post_time if available, otherwise by created_at (most recent first)
        const sortedJobs = sortByDateConsistent(data, 'post_time', 'created_at');
        setJobs(sortedJobs);
      }
      setLoading(false);
    };

    fetchJobs();
  }, [search]);

  // Filter jobs based on search
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    (job.post_name && job.post_name.toLowerCase().includes(search.toLowerCase())) ||
    (job.eligibility && job.eligibility.toLowerCase().includes(search.toLowerCase()))
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    
    // Update URL with search parameter
    const urlParams = new URLSearchParams(location.search);
    if (value.trim()) {
      urlParams.set('search', value.trim());
    } else {
      urlParams.delete('search');
    }
    
    const newUrl = `${location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    navigate(newUrl, { replace: true });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Latest Jobs</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading-skeleton">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="skeleton-item" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">💼</div>
          <h3>No jobs found</h3>
          <p>{search ? `No jobs match "${search}"` : 'No jobs available at the moment'}</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredJobs.map(job => (
            <div key={job.id} className="item-card">
              <Link to={`/jobs/${job.slug}`} className="item-link">
                <h3>{job.title}</h3>
                <div className="item-meta">
                  <span className={`status-badge ${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                  <span className="date">{new Date(job.created_at).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short' 
                  })}</span>
                </div>
                {job.apply_end_date && (
                  <div className="apply-last-date">
                    <small>Apply Last Date: {formatDateToDDMMYYYY(job.apply_end_date)}</small>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPage; 