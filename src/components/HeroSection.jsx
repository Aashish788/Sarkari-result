import React from 'react';
import StructuredData from './StructuredData';

const HeroSection = () => {
  return (
    <>
      {/* Hidden SEO Components - No Visual Impact */}
      <StructuredData type="website" />
      <StructuredData type="organization" />
      
      {/* Hidden SEO Content for Search Engines */}
      <div style={{ display: 'none' }}>
        <h2>Latest Government Jobs 2025 - Sarkari Naukri</h2>
        <p>Find latest government job notifications, sarkari result updates, admit card downloads, answer keys, exam results, recruitment notifications, and employment news. Apply for central government jobs, state government jobs, banking jobs, railway jobs, SSC jobs, UPSC jobs, police jobs, teaching jobs, defense jobs, and more sarkari naukri opportunities.</p>
        
        <h3>Popular Job Categories</h3>
        <ul>
          <li>SSC Jobs - Staff Selection Commission Recruitment</li>
          <li>UPSC Jobs - Union Public Service Commission</li>
          <li>Railway Jobs - Indian Railways Recruitment</li>
          <li>Banking Jobs - Bank Recruitment Notifications</li>
          <li>Police Jobs - Police Constable and SI Posts</li>
          <li>Teaching Jobs - Teacher Recruitment</li>
          <li>Defense Jobs - Army, Navy, Air Force</li>
          <li>State PSC Jobs - Public Service Commission</li>
        </ul>

        <h3>Services We Provide</h3>
        <ul>
          <li>Latest Job Notifications 2025</li>
          <li>Exam Results and Merit Lists</li>
          <li>Admit Cards and Hall Tickets Download</li>
          <li>Official Answer Keys</li>
          <li>Admission Notifications</li>
          <li>Syllabus and Exam Pattern</li>
          <li>Cut-off Marks and Selection Lists</li>
        </ul>
      </div>

      {/* Enhanced Hero Section with Modern Design */}
      <section 
        className="hero" 
        itemScope 
        itemType="https://schema.org/WebPageElement"
        aria-label="Sarkari Result - Government Jobs Portal"
      >
        <div className="hero-container">
          <h1 itemProp="headline">
            Sarkari Result
          </h1>
          <p itemProp="description">
            Get Online Form, Results, Admit Card, Answer Key, Syllabus, Career News, Sarkari Yojana, Scholarship, Sarkari Notice etc.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">1K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Job Updates Daily</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
          <div className="hero-actions">
            <a 
              href="https://chat.whatsapp.com/GNQMuV4AT8p7mcXwDdoigP" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="whatsapp-btn"
              aria-label="Join WhatsApp group for job notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
              </svg>
              Join WhatsApp
            </a>
            <a 
              href="/jobs" 
              className="cta-btn"
              aria-label="Browse latest government jobs"
            >
              Browse Jobs
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection; 