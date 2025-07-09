import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navigation')) {
        closeMobileMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Mobile menu toggle button */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Search bar for mobile - always visible */}
        <div className="mobile-search-container">
          <input 
            type="text" 
            className="mobile-search-input" 
            placeholder="Search..." 
          />
          <button className="mobile-search-btn">🔍</button>
        </div>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/latest-job" className="nav-link" onClick={closeMobileMenu}>Latest Job</Link>
          </li>
          <li className="nav-item">
            <Link to="/admit-card" className="nav-link" onClick={closeMobileMenu}>Admit Card</Link>
          </li>
          <li className="nav-item">
            <Link to="/result" className="nav-link" onClick={closeMobileMenu}>Result</Link>
          </li>
          <li className="nav-item">
            <Link to="/admission" className="nav-link" onClick={closeMobileMenu}>Admission</Link>
          </li>
          <li className="nav-item">
            <Link to="/syllabus" className="nav-link" onClick={closeMobileMenu}>Syllabus</Link>
          </li>
          <li className="nav-item">
            <Link to="/answer-key" className="nav-link" onClick={closeMobileMenu}>Answer Key</Link>
          </li>
          <li className="nav-item">
            <Link to="#" className="nav-link">More</Link>
            <div className="dropdown">
              <Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link>
              <Link to="/privacy" onClick={closeMobileMenu}>Privacy Policy</Link>
              <Link to="/disclaimer" onClick={closeMobileMenu}>Disclaimer</Link>
            </div>
          </li>
          <li className="nav-item nav-search desktop-search">
            <div className="nav-search-container">
              <input 
                type="text" 
                className="nav-search-input" 
                placeholder="Search..." 
              />
              <button className="nav-search-btn">🔍</button>
            </div>
          </li>
          
          {/* Mobile Theme Toggle - Only visible on mobile */}
          <li className="nav-item mobile-theme-toggle">
            <div className="mobile-theme-container">
              <span className="mobile-theme-label">
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
              <button 
                onClick={toggleTheme}
                className="theme-toggle mobile-toggle"
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                <div className="theme-toggle-track">
                  <div className="theme-toggle-thumb">
                    <div className="theme-icon">
                      {isDarkMode ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="5"/>
                          <line x1="12" y1="1" x2="12" y2="3"/>
                          <line x1="12" y1="21" x2="12" y2="23"/>
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                          <line x1="1" y1="12" x2="3" y2="12"/>
                          <line x1="21" y1="12" x2="23" y2="12"/>
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </li>
        </ul>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>}
      </div>
    </nav>
  );
};

export default Navigation; 