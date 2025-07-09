import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const DocumentDetails = () => {
  const { slug } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching document:', error);
        navigate('/'); // Redirect to home on error
        return;
      }

      if (data) {
        setDocument(data);
      }
      setLoading(false);
    };

    fetchDocumentDetails();
  }, [slug, navigate]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this document: ${document.title}`;
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="job-details-container loading">
        <div className="skeleton-title"></div>
        <div className="skeleton-meta"></div>
        
        <div className="job-section">
          <div className="skeleton-header"></div>
          <div className="skeleton-content">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        </div>

        <div className="job-section">
          <div className="skeleton-header"></div>
          <div className="skeleton-content">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!document) return null;

  return (
    <div className="job-details-container">
      <h1 className="job-title">{document.title}</h1>
      
      <div className="post-meta">
        <p>Post Date: {new Date(document.created_at).toLocaleDateString()}</p>
        {document.post_time && <p>{document.post_time}</p>}
      </div>

      <div className="download-buttons">
        <a href="#" className="download-btn" onClick={(e) => { e.preventDefault(); handleShare('whatsapp'); }}>
          <i className="fab fa-whatsapp"></i> WhatsApp
        </a>
        <a href="#" className="download-btn" onClick={(e) => { e.preventDefault(); handleShare('telegram'); }}>
          <i className="fab fa-telegram"></i> Telegram
        </a>
      </div>

      {document.description && (
        <div className="job-section">
          <h2>Description</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
            {document.description}
          </p>
        </div>
      )}

      <div className="job-section">
        <h2>Document Information</h2>
        <div className="vacancy-table">
          <table>
            <thead>
              <tr>
                <th>Information</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Document Title</td>
                <td>{document.title}</td>
              </tr>
              <tr>
                <td>Category</td>
                <td>Government Document</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{document.status || 'Active'}</td>
              </tr>
              <tr>
                <td>Upload Date</td>
                <td>{new Date(document.created_at).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="job-section">
        <h2>Document Access</h2>
        <div className="links-table">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {document.file_url && (
                <tr>
                  <td>Download Document</td>
                  <td><a href={document.file_url} target="_blank" rel="noopener noreferrer" className="apply-link">Click Here</a></td>
                </tr>
              )}
              <tr>
                <td>Share Document</td>
                <td>
                  <button onClick={() => handleShare('whatsapp')} className="share-btn">WhatsApp</button>
                  <button onClick={() => handleShare('telegram')} className="share-btn">Telegram</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="job-section">
        <h2>How to Use This Document</h2>
        <ol className="apply-steps">
          <li>Click on the "Download Document" link above</li>
          <li>Save the document to your device</li>
          <li>Read the document carefully</li>
          <li>Follow the instructions mentioned in the document</li>
          <li>Keep the document for your records</li>
          <li>Share with others who might benefit from this information</li>
        </ol>
      </div>

      <div className="job-section">
        <h2>Important Note</h2>
        <div className="note-container" style={{ 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6', 
          borderRadius: '4px', 
          padding: '15px', 
          marginTop: '10px' 
        }}>
          <p style={{ margin: 0, color: '#495057' }}>
            This document is provided for informational purposes. Please verify the information from official sources before taking any action. 
            We are not responsible for any decisions made based on this document.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails; 