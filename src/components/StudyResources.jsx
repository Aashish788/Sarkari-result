import React from 'react';
import { Link } from 'react-router-dom';

const resourcesData = {
  papersAndTests: [
    {
      id: 'papers-1',
      title: 'UPSC Previous Year Papers',
      description: 'Official source for UPSC previous year question papers for various examinations.',
      link: 'https://upsc.gov.in/examinations/previous-question-papers',
      source: 'upsc.gov.in',
      type: 'papers',
    },
    {
      id: 'papers-2',
      title: 'IBPS Mock Tests',
      description: 'Practice with online mock tests for various banking exams conducted by IBPS.',
      link: 'https://www.ibps.in/online-testing/',
      source: 'ibps.in',
      type: 'test',
    },
    {
      id: 'papers-3',
      title: 'SSC Model Question Papers',
      description: 'Download model question papers for SSC examinations directly from the source.',
      link: 'https://ssc.nic.in/Downloads/portal/english/modal-question-paper-english.pdf',
      source: 'ssc.nic.in',
      type: 'pdf',
    },
    {
      id: 'papers-4',
      title: 'Rajasthan PSC Question Papers',
      description: 'Access a repository of old question papers from the Rajasthan Public Service Commission.',
      link: 'https://rpsc.rajasthan.gov.in/quespapers',
      source: 'rpsc.rajasthan.gov.in',
      type: 'papers',
    },
    {
        id: 'papers-5',
        title: 'Indian Air Force Model Papers',
        description: 'Model question papers for Airmen recruitment, provided by CDAC.',
        link: 'https://airmenselection.cdac.in/CASB/modalqp.html',
        source: 'airmenselection.cdac.in',
        type: 'papers',
    },
    {
        id: 'papers-6',
        title: 'West Bengal PSC Papers',
        description: 'Previous year question papers from the West Bengal Public Service Commission.',
        link: 'https://wbpsc.gov.in/previous_year_question_paper.jsp',
        source: 'wbpsc.gov.in',
        type: 'papers',
    },
  ],
  booksAndPublications: [
    {
      id: 'books-1',
      title: 'MADE EASY Publications',
      description: 'A leading publisher for ESE, GATE, PSUs, and other competitive exam books.',
      link: 'https://madeeasypublications.org/',
      source: 'madeeasypublications.org',
      type: 'book',
    },
    {
      id: 'books-2',
      title: 'GATE-2025 Solved Papers',
      description: 'Previous year solved papers for various engineering disciplines for the GATE exam.',
      link: 'https://madeeasypublications.org/bookdetail/gate-2025-civil-engineering-previous-year-solved-papers',
      source: 'madeeasypublications.org',
      type: 'book',
    },
    {
      id: 'books-3',
      title: 'ESE 2025 Prelims Solved Papers',
      description: 'Objective solved papers for the preliminary stage of the Engineering Services Examination.',
      link: 'https://madeeasypublications.org/bookdetail/ese-2025-preliminary-exam-civil-engineering-objective-solved-paper-vol-1/989',
      source: 'madeeasypublications.org',
      type: 'book',
    },
  ],
  onlinePlatforms: [
    {
      id: 'platform-1',
      title: 'Notopedia',
      description: 'A platform offering free online tests, notes, and papers for a wide range of government exams.',
      link: 'https://www.notopedia.com/sarkari-jobs-exam',
      source: 'notopedia.com',
      type: 'website',
    },
    {
      id: 'platform-2',
      title: 'Sarkari Naukri Blog',
      description: 'Provides information and links to study material and question papers for various government jobs.',
      link: 'https://www.sarkarinaukriblog.com/2019/04/sarkari-naukri-exam-study-material.html',
      source: 'sarkarinaukriblog.com',
      type: 'blog',
    },
  ],
};

const ResourceCard = ({ title, description, link, source, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'pdf':
        return 'fas fa-file-pdf';
      case 'book':
        return 'fas fa-book-open';
      case 'papers':
        return 'fas fa-file-alt';
      case 'test':
        return 'fas fa-vial';
      case 'blog':
        return 'fas fa-blog';
      case 'website':
      default:
        return 'fas fa-globe';
    }
  };

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="resource-card-link">
      <div className="resource-card">
        <div className="resource-card-icon">
          <i className={getIcon()}></i>
        </div>
        <div className="resource-card-content">
          <h3>{title}</h3>
          <p>{description}</p>
          <span>Source: {source}</span>
        </div>
      </div>
    </a>
  );
};

const StudyResources = () => {
  return (
    <div className="page-container study-resources-page">
      <h1 className="page-title">Study Resources</h1>
      <p className="page-subtitle">A curated list of high-quality resources to help you prepare for government exams.</p>

      <div className="resource-category">
        <h2>Previous Year Papers & Mock Tests</h2>
        <div className="resources-grid">
          {resourcesData.papersAndTests.map(resource => (
            <ResourceCard key={resource.id} {...resource} />
          ))}
        </div>
      </div>

      <div className="resource-category">
        <h2>Recommended Books & Publications</h2>
        <div className="resources-grid">
          {resourcesData.booksAndPublications.map(resource => (
            <ResourceCard key={resource.id} {...resource} />
          ))}
        </div>
      </div>

      <div className="resource-category">
        <h2>Online Study Platforms</h2>
        <div className="resources-grid">
          {resourcesData.onlinePlatforms.map(resource => (
            <ResourceCard key={resource.id} {...resource} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyResources;
