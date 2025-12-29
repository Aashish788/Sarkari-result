import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { formatDateToDDMMYYYY } from '../utils/dateUtils';

const AnswerKeyDetails = () => {
  const { slug } = useParams();
  const [answerKey, setAnswerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnswerKeyDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('answer_keys')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching answer key:', error);
        navigate('/'); // Redirect to home on error
        return;
      }

      if (data) {
        setAnswerKey(data);
      }
      setLoading(false);
    };

    fetchAnswerKeyDetails();
  }, [slug, navigate]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this answer key: ${answerKey.title}`;
    
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

  if (!answerKey) return null;

  return (
    <div className="job-details-container">
      <h1 className="job-title">{answerKey.title}</h1>
      
      <div className="post-meta">
        <p>Post Date: {new Date(answerKey.created_at).toLocaleDateString()}</p>
        {answerKey.post_time && <p>{answerKey.post_time}</p>}
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
          <li><strong>Exam Name:</strong> {answerKey.exam_name || 'To be announced'}</li>
          <li><strong>Exam Date:</strong> {formatDateToDDMMYYYY(answerKey.exam_date) || 'To be announced'}</li>
          <li><strong>Admit Card Date:</strong> {formatDateToDDMMYYYY(answerKey.admit_card_date) || 'Before Exam'}</li>
          <li><strong>Answer Key Release Date:</strong> {formatDateToDDMMYYYY(answerKey.answer_key_release_date) || 'To be announced'}</li>
          <li><strong>Objection Start Date:</strong> {formatDateToDDMMYYYY(answerKey.objection_start_date) || 'To be announced'}</li>
          <li><strong>Objection End Date:</strong> {formatDateToDDMMYYYY(answerKey.objection_end_date) || 'To be announced'}</li>
          <li><strong>Result Date:</strong> {formatDateToDDMMYYYY(answerKey.result_date) || 'Will be updated'}</li>
        </ul>
      </div>

      {answerKey.post_name && (
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
                  <td>{answerKey.post_name}</td>
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
              {answerKey.download_link && (
                <tr>
                  <td>Download Answer Key</td>
                  <td><a href={answerKey.download_link} target="_blank" rel="noopener noreferrer" className="apply-link">Click Here</a></td>
                </tr>
              )}
              {answerKey.notification_link && (
                <tr>
                  <td>Download Notification</td>
                  <td><a href={answerKey.notification_link} target="_blank" rel="noopener noreferrer" className="notification-link">Click Here</a></td>
                </tr>
              )}
              {answerKey.official_website && (
                <tr>
                  <td>Official Website</td>
                  <td><a href={answerKey.official_website} target="_blank" rel="noopener noreferrer" className="official-link">Click Here</a></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="job-section">
        <h2>How to Download Answer Key</h2>
        <ol className="apply-steps">
          <li>Visit the official website through the link provided above</li>
          <li>Click on the "Download Answer Key" link</li>
          <li>Download the official answer key PDF</li>
          <li>Match your answers with the official answer key</li>
          <li>Calculate your probable score</li>
          <li>If any objection, submit during the objection period with fee</li>
        </ol>
      </div>

      <div className="job-section">
        <h2>Answer Key Information</h2>
        <div className="documents-table">
          <table>
            <thead>
              <tr>
                <th>Information</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Answer Key Format</td>
                <td>PDF document with question numbers and correct answers</td>
              </tr>
              <tr>
                <td>Objection Process</td>
                <td>Submit objections online during specified period with required fee</td>
              </tr>
              <tr>
                <td>Final Answer Key</td>
                <td>Released after considering all valid objections</td>
              </tr>
              <tr>
                <td>Score Calculation</td>
                <td>Based on final answer key and marking scheme</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnswerKeyDetails; 