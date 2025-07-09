import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { formatDateToDDMMYYYY } from '../utils/dateUtils';

// Import the jobCache from LatestJobsSection
const jobCache = new Map();

const JobDetails = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      // Check cache first
      if (jobCache.has(slug)) {
        setJob(jobCache.get(slug));
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching job:', error);
        navigate('/'); // Redirect to home on error
        return;
      }

      if (data) {
        setJob(data);
        jobCache.set(slug, data); // Cache the result
      }
      setLoading(false);
    };

    fetchJobDetails();
  }, [slug, navigate]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this job: ${job.title}`;
    
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

  if (!job) return null;

  return (
    <div className="job-details-container">
      <h1 className="job-title">{job.title}</h1>
      
      <div className="post-meta">
        <p>Post Date: {new Date(job.created_at).toLocaleDateString()}</p>
        {job.post_time && <p>{job.post_time}</p>}
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
          <li><strong>Online Apply Start Date:</strong> {formatDateToDDMMYYYY(job.apply_start_date) || 'To be announced'}</li>
          <li><strong>Online Apply Last Date:</strong> {formatDateToDDMMYYYY(job.apply_end_date) || 'To be announced'}</li>
          <li><strong>Last Date For Fee Payment:</strong> {formatDateToDDMMYYYY(job.fee_payment_date) || 'To be announced'}</li>
          <li><strong>Exam Date:</strong> {formatDateToDDMMYYYY(job.exam_date) || 'To be notified'}</li>
          <li><strong>Admit Card:</strong> {formatDateToDDMMYYYY(job.admit_card_date) || 'Before Exam'}</li>
          <li><strong>Result Date:</strong> {formatDateToDDMMYYYY(job.result_date) || 'Will be updated'}</li>
        </ul>
      </div>

      <div className="job-section">
        <h2>Application Fee</h2>
        <ul className="fee-list">
          <li><strong>General/OBC Candidates:</strong> ₹{job.fee_general || 'To be announced'}</li>
          <li><strong>SC/ST/EWS Candidates:</strong> ₹{job.fee_sc_st || 'To be announced'}</li>
          <li><strong>Female Candidates:</strong> ₹{job.fee_female || 'To be announced'}</li>
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

      {job.age_limits && (
        <div className="job-section">
          <h2>Age Limits</h2>
          <ul className="date-list">
            <li><strong>Minimum Age:</strong> {job.age_min || 'To be announced'}</li>
            <li><strong>Maximum Age:</strong> {job.age_max || 'To be announced'}</li>
          </ul>
          {job.age_relaxation && (
            <p className="age-relaxation">
              Age relaxation available as per regulations.
            </p>
          )}
        </div>
      )}

      <div className="job-section">
        <h2>Vacancy Details</h2>
        <div className="vacancy-table">
          <table>
            <thead>
              <tr>
                <th>Post Name</th>
                <th>No. of Posts</th>
                <th>Eligibility</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                try {
                  // Try to parse post_name as JSON array
                  const posts = typeof job.post_name === 'string' 
                    ? JSON.parse(job.post_name) 
                    : job.post_name;
                  
                  if (Array.isArray(posts)) {
                    return posts.map((post, index) => (
                      <tr key={index}>
                        <td>{post.name || post}</td>
                        <td>{post.posts || ''}</td>
                        <td>{post.eligibility || job.eligibility || 'Check official notification'}</td>
                      </tr>
                    ));
                  } else {
                    // Fallback for non-JSON format
                    return (
                      <tr>
                        <td>{job.post_name || job.title}</td>
                        <td>{job.total_posts || 'To be announced'}</td>
                        <td>{job.eligibility || 'Check official notification'}</td>
                      </tr>
                    );
                  }
                } catch (error) {
                  // Fallback for parsing errors
                  return (
                    <tr>
                      <td>{job.post_name || job.title}</td>
                      <td>{job.total_posts || 'To be announced'}</td>
                      <td>{job.eligibility || 'Check official notification'}</td>
                    </tr>
                  );
                }
              })()}
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

      {job.selection_process && (
        <div className="job-section">
          <h2>Selection Process</h2>
          <ul className="selection-list">
            {(Array.isArray(job.selection_process) 
              ? job.selection_process 
              : job.selection_process.split(',')
            ).map((step, index) => (
              <li key={index}>{Array.isArray(job.selection_process) ? step : step.trim()}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="job-section">
        <h2>Important Links</h2>
        <div className="links-table">
          <table>
            <tbody>
              <tr>
                <td>Apply Online</td>
                <td>
                  <a href={job.apply_link || '#'} target="_blank" rel="noopener noreferrer">
                    Click Here
                  </a>
                </td>
              </tr>
              <tr>
                <td>Official Notification</td>
                <td>
                  <a href={job.notification_link || '#'} target="_blank" rel="noopener noreferrer">
                    Click Here
                  </a>
                </td>
              </tr>
              <tr>
                <td>Official Website</td>
                <td>
                  <a href={job.official_website || '#'} target="_blank" rel="noopener noreferrer">
                    Click Here
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="job-section">
        <h2>Important Questions</h2>
        <div className="important-questions">
          <div className="question-item">
            <strong>Question: When will the online application start?</strong>
            <p>Answer: The online application will start from {formatDateToDDMMYYYY(job.apply_start_date) || 'To be announced'}.</p>
          </div>
          <div className="question-item">
            <strong>Question: What is the last date for online application?</strong>
            <p>Answer: The last date for online application is {formatDateToDDMMYYYY(job.apply_end_date) || 'To be announced'}.</p>
          </div>
          <div className="question-item">
            <strong>Question: What is the age limit?</strong>
            <p>Answer: The age limit details are available in the official notification.</p>
          </div>
          <div className="question-item">
            <strong>Question: What is the eligibility criteria?</strong>
            <p>Answer: Please check the official notification for detailed eligibility criteria.</p>
          </div>
        </div>
      </div>

      <div className="share-buttons">
        <a href="#" className="share-btn share-whatsapp" onClick={(e) => { e.preventDefault(); handleShare('whatsapp'); }}>
          <i className="fab fa-whatsapp"></i> Share on WhatsApp
        </a>
        <a href="#" className="share-btn share-telegram" onClick={(e) => { e.preventDefault(); handleShare('telegram'); }}>
          <i className="fab fa-telegram"></i> Share on Telegram
        </a>
      </div>
    </div>
  );
};

export default JobDetails; 