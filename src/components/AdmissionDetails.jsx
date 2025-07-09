import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { formatDateToDDMMYYYY } from '../utils/dateUtils';

const AdmissionDetails = () => {
  const { slug } = useParams();
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmissionDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching admission:', error);
        navigate('/'); // Redirect to home on error
        return;
      }

      if (data) {
        setAdmission(data);
      }
      setLoading(false);
    };

    fetchAdmissionDetails();
  }, [slug, navigate]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this admission: ${admission.title}`;
    
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

  if (!admission) return null;

  return (
    <div className="job-details-container">
      <h1 className="job-title">{admission.title}</h1>
      
      <div className="post-meta">
        <p>Post Date: {new Date(admission.created_at).toLocaleDateString()}</p>
        {admission.post_time && <p>{admission.post_time}</p>}
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
          <li><strong>Course Name:</strong> {admission.course_name || 'To be announced'}</li>
          <li><strong>Institution Name:</strong> {admission.institution_name || 'To be announced'}</li>
          <li><strong>Online Apply Start Date:</strong> {formatDateToDDMMYYYY(admission.apply_start_date) || 'To be announced'}</li>
          <li><strong>Online Apply Last Date:</strong> {formatDateToDDMMYYYY(admission.apply_end_date) || 'To be announced'}</li>
          <li><strong>Last Date For Fee Payment:</strong> {formatDateToDDMMYYYY(admission.fee_payment_date) || 'To be announced'}</li>
          <li><strong>Correction Start Date:</strong> {formatDateToDDMMYYYY(admission.correction_start_date) || 'To be announced'}</li>
          <li><strong>Correction End Date:</strong> {formatDateToDDMMYYYY(admission.correction_end_date) || 'To be announced'}</li>
          <li><strong>Entrance Exam Date:</strong> {formatDateToDDMMYYYY(admission.entrance_exam_date) || 'To be announced'}</li>
          <li><strong>Admit Card:</strong> {formatDateToDDMMYYYY(admission.admit_card_date) || 'Before Exam'}</li>
          <li><strong>Result Date:</strong> {formatDateToDDMMYYYY(admission.result_date) || 'Will be updated'}</li>
          <li><strong>Counselling Date:</strong> {formatDateToDDMMYYYY(admission.counselling_date) || 'To be announced'}</li>
        </ul>
      </div>

      <div className="job-section">
        <h2>Application Fee</h2>
        <ul className="fee-list">
          <li><strong>General/OBC Candidates:</strong> ₹{admission.fee_general || 'To be announced'}</li>
          <li><strong>SC/ST/EWS Candidates:</strong> ₹{admission.fee_sc_st || 'To be announced'}</li>
          <li><strong>OBC Candidates:</strong> ₹{admission.fee_obc || 'To be announced'}</li>
        </ul>
        
        <div className="payment-modes">
          <h3>Payment Modes (Online):</h3>
          <ul>
            <li>Debit Card</li>
            <li>Credit Card</li>
            <li>Internet Banking</li>
            <li>IMPS</li>
            <li>Cash Card / Mobile Wallet</li>
          </ul>
        </div>
      </div>

      <div className="job-section">
        <h2>Course Details</h2>
        <div className="vacancy-table">
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Institution</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{admission.course_name || admission.title}</td>
                <td>{admission.institution_name || 'Check notification'}</td>
                <td>Check official notification for eligibility and seat details</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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
              {admission.apply_link && (
                <tr>
                  <td>Apply Online</td>
                  <td><a href={admission.apply_link} target="_blank" rel="noopener noreferrer" className="apply-link">Click Here</a></td>
                </tr>
              )}
              {admission.notification_link && (
                <tr>
                  <td>Download Notification</td>
                  <td><a href={admission.notification_link} target="_blank" rel="noopener noreferrer" className="notification-link">Click Here</a></td>
                </tr>
              )}
              {admission.official_website && (
                <tr>
                  <td>Official Website</td>
                  <td><a href={admission.official_website} target="_blank" rel="noopener noreferrer" className="official-link">Click Here</a></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="job-section">
        <h2>Required Documents</h2>
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
                <td>Photo</td>
                <td>Recent passport-size color photograph in the required format and size</td>
              </tr>
              <tr>
                <td>Signature</td>
                <td>Scanned copy of candidate's signature</td>
              </tr>
              <tr>
                <td>Educational Certificates</td>
                <td>
                  - Class 10 (High School) Marksheet and Certificate<br/>
                  - Class 12 (Intermediate) Marksheet and Certificate<br/>
                  - Other required certificates as per eligibility
                </td>
              </tr>
              <tr>
                <td>Category Certificate</td>
                <td>SC/ST/OBC/EWS certificate (if applicable)</td>
              </tr>
              <tr>
                <td>Other Documents</td>
                <td>As specified in the official notification</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="job-section">
        <h2>How to Apply</h2>
        <ol className="apply-steps">
          <li>Visit the official website through the link provided above</li>
          <li>Click on the "Apply Online" link for this admission</li>
          <li>Register yourself by providing basic details</li>
          <li>Fill in the application form with accurate information</li>
          <li>Upload required documents in specified format</li>
          <li>Pay the application fee online</li>
          <li>Submit the application and take a printout</li>
          <li>Keep the application printout for future reference</li>
        </ol>
      </div>
    </div>
  );
};

export default AdmissionDetails; 