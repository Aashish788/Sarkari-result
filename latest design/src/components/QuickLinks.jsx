import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const QuickLinks = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('title, slug')
        .eq('is_quick_link', true)
        .order('created_at', { ascending: false })
        .limit(9); // Show latest 9 jobs to maintain grid layout

      if (!error && data) {
        setJobs(data);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section className="quick-links">
      <div className="quick-links-container">
        <div className="quick-links-grid">
          {jobs.map((job) => (
            <Link 
              key={job.slug} 
              to={`/jobs/${job.slug}`} 
              className="quick-link-item"
            >
              {job.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks; 