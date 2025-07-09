import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { formatDateToDDMMYYYY } from '../utils/dateUtils';

const AdmitCardDetails = () => {
  const { slug } = useParams();
  const [admitCard, setAdmitCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmitCardDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('admit_cards')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching admit card:', error);
        navigate('/'); // Redirect to home on error
        return;
      }

      if (data) {
        setAdmitCard(data);
      }
      setLoading(false);
    };

    fetchAdmitCardDetails();
  }, [slug, navigate]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this admit card: ${admitCard.title}`;
    
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

  if (!admitCard) return null;

  return (
    <div className="job-details-container">
      <h1 className="job-title">{admitCard.title}</h1>
      
      <div className="post-meta">
        <p>Post Date: {new Date(admitCard.created_at).toLocaleDateString()}</p>
        {admitCard.post_time && <p>{admitCard.post_time}</p>}
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
          <li><strong>Exam Name:</strong> {admitCard.exam_name || 'To be announced'}</li>
          <li><strong>Exam Date:</strong> {formatDateToDDMMYYYY(admitCard.exam_date) || 'To be announced'}</li>
          <li><strong>Admit Card Available Date:</strong> {formatDateToDDMMYYYY(admitCard.admit_card_available_date) || 'To be announced'}</li>
          <li><strong>Admit Card Download Last Date:</strong> {formatDateToDDMMYYYY(admitCard.admit_card_download_last_date) || 'To be announced'}</li>
          <li><strong>Exam City Date:</strong> {formatDateToDDMMYYYY(admitCard.exam_city_date) || 'To be announced'}</li>
          <li><strong>Exam Shift Date:</strong> {formatDateToDDMMYYYY(admitCard.exam_shift_date) || 'To be announced'}</li>
        </ul>
      </div>

      {admitCard.post_name && (
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
                  <td>{admitCard.post_name}</td>
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
              {admitCard.download_link && (
                <tr>
                  <td>Download Admit Card</td>
                  <td><a href={admitCard.download_link} target="_blank" rel="noopener noreferrer" className="apply-link">Click Here</a></td>
                </tr>
              )}
              {admitCard.notification_link && (
                <tr>
                  <td>Download Notification</td>
                  <td><a href={admitCard.notification_link} target="_blank" rel="noopener noreferrer" className="notification-link">Click Here</a></td>
                </tr>
              )}
              {admitCard.official_website && (
                <tr>
                  <td>Official Website</td>
                  <td><a href={admitCard.official_website} target="_blank" rel="noopener noreferrer" className="official-link">Click Here</a></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="job-section">
        <h2>How to Download Admit Card</h2>
        <ol className="apply-steps">
          <li>Visit the official website through the link provided above</li>
          <li>Click on the "Download Admit Card" link</li>
          <li>Enter your registration number and date of birth</li>
          <li>Download and print your admit card</li>
          <li>Carry the admit card along with required documents to the exam center</li>
          <li>Check exam center details and reporting time carefully</li>
        </ol>
      </div>

      <div className="job-section">
        <h2>Required Documents for Exam</h2>
        <div className="documents-table">
          <table>
            <thead>
              <tr>
                <th>Document Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Admit Card</td>
                <td>Original admit card downloaded from official website</td>
              </tr>
              <tr>
                <td>Photo ID Proof</td>
                <td>Any one: Aadhaar Card, Voter ID, Driving License, PAN Card, Passport</td>
              </tr>
              <tr>
                <td>Passport Size Photos</td>
                <td>Recent passport-size color photographs (as specified)</td>
              </tr>
              <tr>
                <td>Other Documents</td>
                <td>Any additional documents mentioned in the admit card</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdmitCardDetails; 