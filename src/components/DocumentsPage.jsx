import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { formatDateToDDMMYYYY, sortByDateConsistent } from '../utils/dateUtils';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
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
    const fetchDocuments = async () => {
      setLoading(true);
      let query = supabase
        .from('documents')
        .select('*');

      // Add search filter if search term exists
      if (search.trim()) {
        query = query.or(`title.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`);
      }

      const { data, error } = await query;

      if (!error && data) {
        // Sort by post_time if available, otherwise by created_at (most recent first)
        const sortedDocuments = sortByDateConsistent(data, 'post_time', 'created_at');
        setDocuments(sortedDocuments);
      }
      setLoading(false);
    };

    fetchDocuments();
  }, [search]);

  // Filter documents based on search
  const filteredDocuments = documents.filter(document =>
    document.title.toLowerCase().includes(search.toLowerCase()) ||
    (document.description && document.description.toLowerCase().includes(search.toLowerCase()))
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
      <h1 className="page-title">Documents</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search documents..."
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
      ) : filteredDocuments.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">📄</div>
          <h3>No documents found</h3>
          <p>{search ? `No documents match "${search}"` : 'No documents available at the moment'}</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredDocuments.map(document => (
            <div key={document.id} className="item-card">
              {document.document_url ? (
                <a href={document.document_url} target="_blank" rel="noopener noreferrer" className="item-link">
                  <h3>{document.title}</h3>
                  <div className="item-meta">
                    <span className="status-badge active">
                      📎 External Link
                    </span>
                    <span className="date">{new Date(document.created_at).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}</span>
                  </div>
                  {document.description && (
                    <div className="document-description">
                      <small>{document.description}</small>
                    </div>
                  )}
                </a>
              ) : (
                <Link to={`/documents/${document.slug}`} className="item-link">
                  <h3>{document.title}</h3>
                  <div className="item-meta">
                    <span className="status-badge active">
                      📄 Document
                    </span>
                    <span className="date">{new Date(document.created_at).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}</span>
                  </div>
                  {document.description && (
                    <div className="document-description">
                      <small>{document.description}</small>
                    </div>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
