import React from 'react';
import { Link } from 'react-router-dom';
import StructuredData from './StructuredData';
import './HeroSection.css';

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

      {/* Enhanced Hero Section */}
      <section 
        className="hero" 
        itemScope 
        itemType="https://schema.org/WebPageElement"
        aria-label="Sarkari Result - Government Jobs Portal"
      >
        <div className="hero-container">
          <h1 itemProp="headline">Sarkari Result</h1>
          <p itemProp="description">
            Your One-Stop Portal for Government Jobs, Results, and Career Resources
          </p>
          
          <div className="hero-buttons-grid">
            <Link to="/jobs" className="hero-button primary">
              <i className="fas fa-search"></i>
              Browse Jobs
            </Link>
            <button className="hero-button secondary" onClick={() => window.location.href='/results'}>
              <i className="fas fa-clipboard-check"></i>
              Check Results
            </button>
            <button className="hero-button tertiary" onClick={() => window.location.href='/career-blog'}>
              <i className="fas fa-blog"></i>
              Career Blogs
            </button>
            <Link to="/study-resources" className="hero-button quaternary">
              <i className="fas fa-book"></i>
              Study Resources
            </Link>
            <button className="hero-button quinary" onClick={() => window.location.href='/previous-papers'}>
              <i className="fas fa-file-alt"></i>
              Previous Papers
            </button>
            <Link to="/latest-updates" className="hero-button senary">
              <i className="fas fa-bell"></i>
              Latest Updates
            </Link>
          </div>

          <div className="social-links">
            <a 
              href="https://chat.whatsapp.com/GNQMuV4AT8p7mcXwDdoigP" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn whatsapp-btn"
              aria-label="Join WhatsApp group for job notifications"
            >
              <i className="fab fa-whatsapp"></i>
              Join WhatsApp
            </a>
            <a 
              href="/telegram" 
              className="social-btn telegram-btn"
              aria-label="Join Telegram channel"
            >
              <i className="fab fa-telegram-plane"></i>
              Join Telegram
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection; 