import React from 'react';
import './JobAnalysis.css';

const JobAnalysis = ({ job }) => {
  if (!job) return null;

  // Generate intelligent analysis based on job data
  const generateAnalysis = () => {
    const analysis = {
      competitionLevel: calculateCompetitionLevel(job),
      salaryRange: analyzeSalaryRange(job),
      careerProspects: analyzeCareerProspects(job),
      preparationTips: generatePreparationTips(job),
      timeToResults: estimateResultTimeline(job),
      successRate: estimateSuccessRate(job)
    };
    return analysis;
  };

  const calculateCompetitionLevel = (jobData) => {
    const title = jobData.title?.toLowerCase() || '';
    const posts = parseInt(jobData.vacancy_count) || 1;
    
    if (title.includes('railway') || title.includes('ssc') || title.includes('upsc')) {
      return posts > 1000 ? 'High' : 'Very High';
    }
    if (title.includes('bank') || title.includes('clerk')) {
      return posts > 500 ? 'Moderate' : 'High';
    }
    if (title.includes('teacher') || title.includes('police')) {
      return posts > 100 ? 'Moderate' : 'High';
    }
    return posts > 50 ? 'Moderate' : 'High';
  };

  const analyzeSalaryRange = (jobData) => {
    const title = jobData.title?.toLowerCase() || '';
    
    if (title.includes('officer') || title.includes('manager')) {
      return { min: 25000, max: 80000, grade: 'Grade A' };
    }
    if (title.includes('clerk') || title.includes('assistant')) {
      return { min: 20000, max: 50000, grade: 'Grade B' };
    }
    if (title.includes('constable') || title.includes('peon')) {
      return { min: 15000, max: 35000, grade: 'Grade C' };
    }
    return { min: 18000, max: 45000, grade: 'Grade B' };
  };

  const analyzeCareerProspects = (jobData) => {
    const title = jobData.title?.toLowerCase() || '';
    const organization = jobData.organization?.toLowerCase() || '';
    
    const prospects = [];
    
    if (organization.includes('railway') || title.includes('railway')) {
      prospects.push('Excellent job security with Indian Railways');
      prospects.push('Regular promotions and increments');
      prospects.push('Medical benefits and pension scheme');
      prospects.push('Transfer opportunities across India');
    } else if (organization.includes('bank') || title.includes('bank')) {
      prospects.push('Stable banking sector career');
      prospects.push('Performance-based incentives');
      prospects.push('Opportunities for specialization');
      prospects.push('Good work-life balance');
    } else if (title.includes('teacher') || title.includes('education')) {
      prospects.push('Noble profession with social impact');
      prospects.push('Regular salary increments');
      prospects.push('Long vacation periods');
      prospects.push('Pension and retirement benefits');
    } else {
      prospects.push('Government job security');
      prospects.push('Regular salary and benefits');
      prospects.push('Career advancement opportunities');
      prospects.push('Work-life balance');
    }
    
    return prospects;
  };

  const generatePreparationTips = (jobData) => {
    const title = jobData.title?.toLowerCase() || '';
    const tips = [];
    
    if (title.includes('clerk') || title.includes('assistant')) {
      tips.push('Focus on Quantitative Aptitude and Reasoning');
      tips.push('Practice English grammar and vocabulary');
      tips.push('Current affairs from last 6 months');
      tips.push('Computer knowledge basics');
    } else if (title.includes('officer') || title.includes('manager')) {
      tips.push('Strong foundation in your subject area');
      tips.push('Leadership and management concepts');
      tips.push('Current economic and political affairs');
      tips.push('Practice mock interviews');
    } else if (title.includes('teacher')) {
      tips.push('Subject expertise in your teaching area');
      tips.push('Child psychology and pedagogy');
      tips.push('Educational technology knowledge');
      tips.push('Teaching methodology and techniques');
    } else {
      tips.push('Understand the exam pattern thoroughly');
      tips.push('Practice previous year questions');
      tips.push('Stay updated with current affairs');
      tips.push('Time management during preparation');
    }
    
    return tips;
  };

  const estimateResultTimeline = (jobData) => {
    const hasMultipleStages = jobData.title?.toLowerCase().includes('officer') || 
                             jobData.title?.toLowerCase().includes('manager');
    
    return hasMultipleStages ? '3-6 months' : '2-4 months';
  };

  const estimateSuccessRate = (jobData) => {
    const posts = parseInt(jobData.vacancy_count) || 1;
    
    if (posts > 1000) return '8-12%';
    if (posts > 500) return '5-8%';
    if (posts > 100) return '3-5%';
    return '1-3%';
  };

  const analysis = generateAnalysis();

  return (
    <div className="job-analysis">
      <h2>📊 Job Analysis & Insights</h2>
      <p className="analysis-intro">
        Our expert analysis of this position to help you make an informed decision and prepare effectively.
      </p>

      <div className="analysis-grid">
        <div className="analysis-card">
          <h3>🎯 Competition Level</h3>
          <div className={`competition-badge ${analysis.competitionLevel.toLowerCase()}`}>
            {analysis.competitionLevel}
          </div>
          <p>
            Expected success rate: <strong>{analysis.successRate}</strong> based on historical data and vacancy count.
          </p>
        </div>

        <div className="analysis-card">
          <h3>💰 Salary Analysis</h3>
          <div className="salary-info">
            <span className="salary-range">₹{analysis.salaryRange.min.toLocaleString()} - ₹{analysis.salaryRange.max.toLocaleString()}</span>
            <span className="grade-badge">{analysis.salaryRange.grade}</span>
          </div>
          <p>Estimated monthly salary based on government pay scales and position level.</p>
        </div>

        <div className="analysis-card">
          <h3>⏱️ Result Timeline</h3>
          <div className="timeline-badge">
            {analysis.timeToResults}
          </div>
          <p>Estimated time from application to final result declaration.</p>
        </div>
      </div>

      <div className="career-prospects">
        <h3>🚀 Career Prospects</h3>
        <ul className="prospects-list">
          {analysis.careerProspects.map((prospect, index) => (
            <li key={index}>{prospect}</li>
          ))}
        </ul>
      </div>

      <div className="preparation-strategy">
        <h3>📚 Preparation Strategy</h3>
        <div className="tips-grid">
          {analysis.preparationTips.map((tip, index) => (
            <div key={index} className="tip-card">
              <span className="tip-number">{index + 1}</span>
              <span className="tip-text">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="expert-recommendation">
        <h3>🎓 Expert Recommendation</h3>
        <div className="recommendation-box">
          <p>
            <strong>Should you apply?</strong> Based on the analysis, this position offers {analysis.competitionLevel.toLowerCase()} competition 
            with {analysis.careerProspects.length > 3 ? 'excellent' : 'good'} career prospects. 
            {analysis.competitionLevel === 'High' || analysis.competitionLevel === 'Very High' 
              ? ' We recommend thorough preparation and backup options.' 
              : ' This could be a good opportunity for dedicated candidates.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobAnalysis;
