import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Cache for storing job details
const jobCache = new Map();

// Function to convert simple format to Date object for sorting
const convertSimpleFormatToDate = (postTime) => {
  if (!postTime) return new Date(0);
  try {
    // Handle both simple format "DD/MM/YYYY HH:MM AM/PM" and ISO format fallback
    if (postTime.includes('/')) {
      // Simple format "DD/MM/YYYY HH:MM AM/PM"
      const parts = postTime.split(' ');
      if (parts.length >= 3) {
        const datePart = parts[0]; // "DD/MM/YYYY"
        const timePart = parts[1]; // "HH:MM"
        const ampm = parts[2]; // "AM/PM"
        
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart.split(':');
        
        let hour24 = parseInt(hours);
        if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
        if (ampm === 'AM' && hour24 === 12) hour24 = 0;
        
        // Create date with proper month (month - 1 because Date months are 0-indexed)
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour24, parseInt(minutes));
        return date;
      }
    }
    
    // Fallback to ISO format or direct Date parsing
    return new Date(postTime);
  } catch (error) {
    console.error('Error converting simple format to date:', error, 'Input:', postTime);
    return new Date(0);
  }
};

const LatestJobsSection = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Prefetch job details
  const prefetchJobDetails = useCallback(async (slug) => {
    if (jobCache.has(slug)) return;

    try {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (data) {
        jobCache.set(slug, data);
      }
    } catch (error) {
      console.error('Error prefetching job:', error);
    }
  }, []);

  // Handle job click with instant navigation
  const handleJobClick = (slug) => {
    if (jobCache.has(slug)) {
      // If we have cached data, navigate instantly
      navigate(`/jobs/${slug}`);
    } else {
      // If no cache, fetch first then navigate
      prefetchJobDetails(slug).then(() => {
        navigate(`/jobs/${slug}`);
      });
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      let query = supabase
        .from('jobs')
        .select('id, title, status, slug, is_featured, created_at, display_order, post_time')
        .eq('status', 'active') // Only show active jobs
        .order('post_time', { ascending: false })
        .limit(25);

      if (search.trim()) {
        query = query.ilike('title', `%${search.trim()}%`);
      }

      const { data, error } = await query;
      
      if (!error && data) {
        // Ensure proper chronological ordering by post_time
        const sortedJobs = data.sort((a, b) => {
          // Convert simple format "DD/MM/YYYY HH:MM AM/PM" to Date
          const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
          const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
          return dateB - dateA; // Most recent first
        });
        
        setJobs(sortedJobs);
        // Prefetch first 5 jobs for instant access
        sortedJobs.slice(0, 5).forEach(job => {
          prefetchJobDetails(job.slug);
        });
      }
      setLoading(false);
    };

    // Debounce search to prevent too many requests
    const timeoutId = setTimeout(fetchJobs, 300);
    return () => clearTimeout(timeoutId);
  }, [search, prefetchJobDetails]);

  // Real-time subscription for instant updates
  useEffect(() => {
    const subscription = supabase
      .channel('jobs_realtime_channel', {
        config: {
          broadcast: { self: true },
          presence: { key: 'user_id' }
        }
      })
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'jobs',
          filter: 'status=eq.active'
        }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          console.log('Event type:', payload.eventType);
          console.log('New data:', payload.new);
          
          if (payload.eventType === 'INSERT') {
            // Add new job to the top
            setJobs(prevJobs => {
              const newJobs = [payload.new, ...prevJobs];
              return newJobs.sort((a, b) => {
                const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
                const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
                return dateB - dateA;
              });
            });
          } else if (payload.eventType === 'UPDATE') {
            // Update existing job
            setJobs(prevJobs => {
              const updatedJobs = prevJobs.map(job => 
                job.id === payload.new.id ? payload.new : job
              );
              return updatedJobs.sort((a, b) => {
                const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
                const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
                return dateB - dateA;
              });
            });
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted job
            setJobs(prevJobs => prevJobs.filter(job => job.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Force refresh when app comes into focus (critical for PWAs)
  useEffect(() => {
    const handleFocus = () => {
      console.log('App focused - refreshing jobs data');
      // Trigger a fresh data fetch when user returns to the app
      const fetchLatestJobs = async () => {
        let query = supabase
          .from('jobs')
          .select('id, title, status, slug, is_featured, created_at, display_order, post_time')
          .eq('status', 'active')
          .order('post_time', { ascending: false })
          .limit(25);

        const { data, error } = await query;
        
        if (!error && data) {
          const sortedJobs = data.sort((a, b) => {
            const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
            const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
            return dateB - dateA;
          });
          setJobs(sortedJobs);
          console.log('Jobs refreshed on focus:', sortedJobs.length, 'jobs loaded');
        }
      };
      
      fetchLatestJobs();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleFocus();
      }
    };

    // Add event listeners for PWA focus detection
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Prefetch job details on hover
  const handleJobHover = useCallback((slug) => {
    if (!jobCache.has(slug)) {
      prefetchJobDetails(slug);
    }
  }, [prefetchJobDetails]);

  return (
    <div className="section">
      <h2 className="section-title">Latest Jobs</h2>
      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-bar"
        style={{ marginBottom: 16, padding: 8, width: '100%' }}
      />
      {loading ? (
        <div className="loading-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-item" />
          ))}
        </div>
      ) : (
        <ul className="section-list">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                to={`/jobs/${job.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleJobClick(job.slug);
                }}
                onMouseEnter={() => handleJobHover(job.slug)}
                className="job-link"
              >
                {job.title}
                <span className={job.status === 'Start' || job.status === 'Date Extend' ? 'date-badge' : 'new-badge'}>
                  {job.status || 'New'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="view-more">
        <Link to="/jobs" className="view-more-btn">View More</Link>
      </div>
    </div>
  );
};

export default LatestJobsSection; 