import React, { useState, useEffect } from 'react';
import ResultsSection from './ResultsSection';
import AdmitCardsSection from './AdmitCardsSection';
import LatestJobsSection from './LatestJobsSection';
import AnswerKeySection from './AnswerKeySection';
import AdmissionSection from './AdmissionSection';
import DocumentsSection from './DocumentsSection';
import SarkariResultInfo from './SarkariResultInfo';
import TopPagesTable from './TopPagesTable';
import FAQ from './FAQ';

const MainContent = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="main-content-full">
      {/* Desktop layout */}
      {!isMobile && (
        <div className="desktop-layout">
          {/* First Row: Results, Admit Cards, Latest Jobs */}
          <div className="sections-grid-row">
            <ResultsSection />
            <AdmitCardsSection />
            <LatestJobsSection />
          </div>
          
          {/* Second Row: Answer Key, Documents, Admission */}
          <div className="sections-grid-row">
            <AnswerKeySection />
            <DocumentsSection />
            <AdmissionSection />
          </div>
        </div>
      )}

      {/* Mobile layout */}
      {isMobile && (
        <div className="mobile-layout">
          {/* Mobile Row 1: Results and Latest Jobs */}
          <div className="mobile-row">
            <ResultsSection />
            <LatestJobsSection />
          </div>
          
          {/* Mobile Row 2: Answer Key and Admit Card */}
          <div className="mobile-row">
            <AnswerKeySection />
            <AdmitCardsSection />
          </div>
          
          {/* Mobile Row 3: Admission and Documents */}
          <div className="mobile-row">
            <AdmissionSection />
            <DocumentsSection />
          </div>
        </div>
      )}
      
      {/* Additional content below the grid */}
      <SarkariResultInfo />
      <TopPagesTable />
      <FAQ />
    </div>
  );
};

export default MainContent; 