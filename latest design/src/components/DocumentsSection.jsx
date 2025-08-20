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

const DocumentsSection = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      let query = supabase
        .from('documents')
        .select('id, title, slug, document_url, created_at, post_time')
        .order('post_time', { ascending: false })
        .limit(25);
      if (search.trim()) {
        query = query.ilike('title', `%${search.trim()}%`);
      }
      const { data, error } = await query;
      if (!error && data) {
        // Client-side sorting to ensure proper chronological order
        const sortedDocuments = data.sort((a, b) => {
          const dateA = convertSimpleFormatToDate(a.post_time || a.created_at);
          const dateB = convertSimpleFormatToDate(b.post_time || b.created_at);
          return dateB - dateA; // Most recent first
        });
        setDocuments(sortedDocuments);
      }
      setLoading(false);
    };
    fetchDocuments();
  }, [search]);

  return (
    <div className="section">
      <h2 className="section-title">Documents</h2>
      <input
        type="text"
        placeholder="Search documents..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-bar"
        style={{ marginBottom: 16, padding: 8, width: '100%' }}
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
      <ul className="section-list">
          {documents.map((doc) => (
            <li key={doc.id}>
              {doc.document_url ? (
                <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                  {doc.title}
                </a>
              ) : (
                <Link to={`/documents/${doc.slug}`}>
                  {doc.title}
                </Link>
              )}
          </li>
        ))}
      </ul>
      )}
      <div className="view-more">
        <Link to="/documents" className="view-more-btn">View More</Link>
      </div>
    </div>
  );
};

export default DocumentsSection; 