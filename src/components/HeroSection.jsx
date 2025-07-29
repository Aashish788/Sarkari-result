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

      {/* Original Hero Section - Unchanged */}
      <section 
        className="hero" 
        itemScope 
        itemType="https://schema.org/WebPageElement"
        aria-label="Sarkari Result - Government Jobs Portal"
      >
        <div className="hero-container">
          <h1 itemProp="headline">Sarkari Result</h1>
          <p itemProp="description">
            Get Online Form, Results, Admit Card, Answer Key, Syllabus, Career News, Sarkari Yojana, Scholarship, Sarkari Notice etc.
          </p>
          <a 
            href="https://chat.whatsapp.com/GNQMuV4AT8p7mcXwDdoigP" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="whatsapp-btn"
            aria-label="Join WhatsApp group for job notifications"
          >
            📢 Join WhatsApp
          </a>
        </div>
      </section>
    </>
  );
};

export default HeroSection; 