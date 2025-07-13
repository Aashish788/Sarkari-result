import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { formatDateToDDMMYYYY, getApplicationStatus } from '../utils/dateUtils';

const ResultDetails = () => {
  const { slug } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResultDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching result:', error);
        navigate('/'); // Redirect to home on error
        return;
      }

      if (data) {
        setResult(data);
      }
      setLoading(false);
    };

    fetchResultDetails();
  }, [slug, navigate]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this result: ${result.title}`;
    
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

  if (!result) return null;

  return (
    <div className="job-details-container">
      <h1 className="job-title">{result.title}</h1>
      
      <div className="post-meta">
        <p>Post Date: {new Date(result.created_at).toLocaleDateString()}</p>
        {result.post_time && <p>{result.post_time}</p>}
      </div>

      <div className="download-buttons">
        <a href="#" className="download-btn" onClick={(e) => { e.preventDefault(); handleShare('whatsapp'); }}>
          <i className="fab fa-whatsapp"></i> WhatsApp
        </a>
        <a href="#" className="download-btn" onClick={(e) => { e.preventDefault(); handleShare('telegram'); }}>
          <i className="fab fa-telegram"></i> Telegram
        </a>
      </div>

      <div className="job-section">
        <h2>Important Dates</h2>
        <ul className="date-list">
          <li>
            <strong>Online Apply Start Date:</strong> {formatDateToDDMMYYYY(result.apply_start_date) || 'To be announced'}
            {(() => {
              const applicationStatus = getApplicationStatus(
                formatDateToDDMMYYYY(result.apply_start_date), 
                formatDateToDDMMYYYY(result.apply_end_date), 
                result.apply_link
              );
              return applicationStatus.showOpeningSoon && (
                <span className="opening-soon-tag">Opening Soon</span>
              );
            })()}
          </li>
          <li><strong>Online Apply Last Date:</strong> {formatDateToDDMMYYYY(result.apply_end_date) || 'To be announced'}
            {(() => {
              const applicationStatus = getApplicationStatus(
                formatDateToDDMMYYYY(result.apply_start_date), 
                formatDateToDDMMYYYY(result.apply_end_date), 
                result.apply_link
              );
              return applicationStatus.showApplicationClosed && (
                <span className="application-closed-tag">Application Closed</span>
              );
            })()}
          </li>
          <li><strong>Last Date For Fee Payment:</strong> {formatDateToDDMMYYYY(result.fee_payment_date) || 'To be announced'}</li>
          <li><strong>Correction Start Date:</strong> {formatDateToDDMMYYYY(result.correction_start_date) || 'To be announced'}</li>
          <li><strong>Correction End Date:</strong> {formatDateToDDMMYYYY(result.correction_end_date) || 'To be announced'}</li>
          <li><strong>PE Exam Date:</strong> {formatDateToDDMMYYYY(result.pe_exam_date) || 'To be announced'}</li>
          <li><strong>PM/PMM Exam Date:</strong> {formatDateToDDMMYYYY(result.pm_pmm_exam_date) || 'To be announced'}</li>
          <li><strong>Admit Card:</strong> {formatDateToDDMMYYYY(result.admit_card_date) || 'Before Exam'}</li>
          <li><strong>Result Date:</strong> {formatDateToDDMMYYYY(result.result_declared_date) || 'Will be updated'}</li>
        </ul>
      </div>

      {result.post_name && (
        <div className="job-section">
          <h2>Post Details</h2>
          <div className="vacancy-table">
            <table>
              <thead>
                <tr>
                  <th>Post Name</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{result.post_name}</td>
                  <td>Check official notification for details</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="job-section">
        <h2>Important Links</h2>
        <div className="links-table">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Apply Online</td>
                <td>
                  {(() => {
                    const applicationStatus = getApplicationStatus(
                      formatDateToDDMMYYYY(result.apply_start_date), 
                      formatDateToDDMMYYYY(result.apply_end_date), 
                      result.apply_link
                    );
                    
                    if (applicationStatus.canApply) {
                      return (
                        <a 
                          href={result.apply_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="apply-link active"
                        >
                          {applicationStatus.buttonText}
                        </a>
                      );
                    } else {
                      return (
                        <span className={`apply-link disabled ${applicationStatus.status}`}>
                          {applicationStatus.buttonText}
                        </span>
                      );
                    }
                  })()}
                </td>
              </tr>
              {result.notification_link && (
                <tr>
                  <td>Download Notification</td>
                  <td><a href={result.notification_link} target="_blank" rel="noopener noreferrer" className="notification-link">Click Here</a></td>
                </tr>
              )}
              {result.official_website && (
                <tr>
                  <td>Official Website</td>
                  <td><a href={result.official_website} target="_blank" rel="noopener noreferrer" className="official-link">Click Here</a></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="job-section">
        <h2>How to Apply</h2>
        <ol className="apply-steps">
          <li>Visit the official website through the link provided above</li>
          <li>Click on the "Apply Online" link for this result</li>
          <li>Read the official notification carefully</li>
          <li>Check your result status and download if available</li>
          <li>Take a printout for your records</li>
        </ol>
      </div>
    </div>
  );
};

export default ResultDetails; 