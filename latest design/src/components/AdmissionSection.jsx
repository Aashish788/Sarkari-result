import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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

const AdmissionSection = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAdmissions = async () => {
      setLoading(true);
      let query = supabase
        .from('admissions')
        .select('id, title, status, slug, application_start, application_end, created_at, post_time')
        .order('post_time', { ascending: false })
        .limit(25);
      if (search.trim()) {
        query = query.ilike('title', `%${search.trim()}%`);
      }
      const { data, error } = await query;
      if (!error && data) {
        // Client-side sorting to ensure proper chronological order
        const sortedAdmissions = data.sort((a, b) => {
          const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
          const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
          return dateB - dateA; // Most recent first
        });
        setAdmissions(sortedAdmissions);
      }
      setLoading(false);
    };
    fetchAdmissions();
  }, [search]);

  return (
    <div className="section">
      <h2 className="section-title">Admission</h2>
      <input
        type="text"
        placeholder="Search admissions..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-bar"
        style={{ marginBottom: 16, padding: 8, width: '100%' }}
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
      <ul className="section-list">
          {admissions.map((admission) => (
            <li key={admission.id}>
              <Link to={`/admissions/${admission.slug}`}>
              {admission.title}
              <span className={admission.status === 'Start' || admission.status === 'Date Extend' ? 'date-badge' : 'new-badge'}>
                  {admission.status || 'New'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      )}
      <div className="view-more">
        <Link to="/admissions" className="view-more-btn">View More</Link>
      </div>
    </div>
  );
};

export default AdmissionSection; 