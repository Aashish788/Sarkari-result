import React, { useState } from 'react';
import { papersData } from './previousYearPapersData';

const AccordionItem = ({ exam, isOpen, onClick }) => {
  return (
    <div className="exam-accordion-item">
      <button className="exam-accordion-header" onClick={onClick}>
        <span>{exam.name}</span>
        <i className={`fas fa-chevron-down ${isOpen ? 'open' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="exam-accordion-content">
          <ul>
            {exam.papers.map((paper) => (
              <li key={paper.year}>
                <a href={paper.link} target="_blank" rel="noopener noreferrer">
                  {exam.name} - {paper.year}
                  <i className="fas fa-external-link-alt"></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const PreviousYearPapers = () => {
  const [openExam, setOpenExam] = useState(null);

  const toggleExam = (examName) => {
    setOpenExam(openExam === examName ? null : examName);
  };

  return (
    <div className="page-container previous-papers-page">
      <h1 className="page-title">Previous Year Question Papers</h1>
      <p className="page-subtitle">Access a comprehensive archive of question papers to aid your exam preparation.</p>

      {Object.values(papersData).map((category) => (
        <div key={category.title} className="category-section">
          <h2>{category.title}</h2>
          <div className="exams-list">
            {category.exams.map((exam) => (
              <AccordionItem
                key={exam.name}
                exam={exam}
                isOpen={openExam === exam.name}
                onClick={() => toggleExam(exam.name)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviousYearPapers;
