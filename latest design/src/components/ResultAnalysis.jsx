import React from 'react';
import './ResultAnalysis.css';

const ResultAnalysis = ({ result }) => {
  if (!result) return null;

  // Generate comprehensive result analysis
  const generateResultAnalysis = () => {
    const analysis = {
      performanceMetrics: analyzePerformance(result),
      trendAnalysis: analyzeTrends(result),
      cutoffAnalysis: analyzeCutoffs(result),
      nextSteps: suggestNextSteps(result),
      careerGuidance: provideCareerGuidance(result),
      documentChecklist: getDocumentChecklist(result),
      timelineGuidance: getTimelineGuidance(result)
    };
    return analysis;
  };

  const analyzePerformance = (data) => {
    const title = data?.title?.toLowerCase() || '';
    
    return {
      totalCandidates: estimateCandidates(title),
      qualifiedCandidates: estimateQualified(title),
      selectionRatio: calculateSelectionRatio(title),
      performanceFactors: getPerformanceFactors(title)
    };
  };

  const estimateCandidates = (title) => {
    if (title.includes('ssc') || title.includes('bank')) return '5-10 Lakh';
    if (title.includes('railway')) return '2-8 Lakh';
    if (title.includes('upsc')) return '10-12 Lakh';
    if (title.includes('teacher')) return '3-6 Lakh';
    return '1-5 Lakh';
  };

  const estimateQualified = (title) => {
    if (title.includes('ssc')) return '2-4 Lakh';
    if (title.includes('bank')) return '50K-2 Lakh';
    if (title.includes('railway')) return '1-3 Lakh';
    if (title.includes('upsc')) return '15-20K';
    return '50K-1 Lakh';
  };

  const calculateSelectionRatio = (title) => {
    if (title.includes('upsc')) return '1:1000';
    if (title.includes('ssc') || title.includes('bank')) return '1:200';
    if (title.includes('railway')) return '1:150';
    return '1:100';
  };

  const getPerformanceFactors = (title) => {
    return [
      'Preparation quality and duration',
      'Mock test performance consistency',
      'Time management during exam',
      'Accuracy vs speed balance',
      'Subject-wise strength distribution',
      'Current affairs knowledge',
      'Exam temperament and composure'
    ];
  };

  const analyzeTrends = (data) => {
    const title = data?.title?.toLowerCase() || '';
    
    return {
      cutoffTrends: getCutoffTrends(title),
      competitionLevel: getCompetitionLevel(title),
      futurePredictions: getFuturePredictions(title)
    };
  };

  const getCutoffTrends = (title) => {
    if (title.includes('ssc')) {
      return {
        trend: 'Increasing',
        change: '+2-3 marks yearly',
        reason: 'Growing competition and better preparation'
      };
    } else if (title.includes('bank')) {
      return {
        trend: 'Stable',
        change: '±1 mark variation',
        reason: 'Consistent difficulty level maintained'
      };
    }
    
    return {
      trend: 'Moderate increase',
      change: '+1-2 marks yearly',
      reason: 'Increased awareness and competition'
    };
  };

  const getCompetitionLevel = (title) => {
    if (title.includes('upsc')) return { level: 'Extremely High', factor: '1000+ per seat' };
    if (title.includes('ssc') || title.includes('bank')) return { level: 'Very High', factor: '200-500 per seat' };
    if (title.includes('railway')) return { level: 'High', factor: '100-200 per seat' };
    return { level: 'Moderate to High', factor: '50-150 per seat' };
  };

  const getFuturePredictions = (title) => {
    return [
      'Digital transformation will increase application numbers',
      'Technology-based questions likely to increase',
      'More emphasis on current affairs and practical knowledge',
      'Interview process becoming more competency-based'
    ];
  };

  const analyzeCutoffs = (data) => {
    return {
      categoryWise: getCategoryWiseCutoffs(),
      sectionalCutoffs: getSectionalCutoffs(),
      safeCutoffs: getSafeCutoffs()
    };
  };

  const getCategoryWiseCutoffs = () => {
    return [
      { category: 'General/EWS', range: '85-95%', description: 'Highest cutoff due to intense competition' },
      { category: 'OBC', range: '80-90%', description: '5-8 marks relaxation from general category' },
      { category: 'SC', range: '70-80%', description: '10-15 marks relaxation from general category' },
      { category: 'ST', range: '65-75%', description: '15-20 marks relaxation from general category' },
      { category: 'PH', range: '60-70%', description: 'Additional relaxation for disabled candidates' }
    ];
  };

  const getSectionalCutoffs = () => {
    return [
      { section: 'Quantitative Aptitude', cutoff: '40-50%', tip: 'Focus on accuracy over speed' },
      { section: 'Reasoning Ability', cutoff: '45-55%', tip: 'Practice puzzles and seating arrangement' },
      { section: 'English Language', cutoff: '35-45%', tip: 'Grammar and reading comprehension are key' },
      { section: 'General Awareness', cutoff: '50-60%', tip: 'Current affairs of last 6 months crucial' }
    ];
  };

  const getSafeCutoffs = () => {
    return {
      recommendation: 'Aim for 10-15 marks above expected cutoff',
      buffer: 'Safe zone ensures selection despite cutoff fluctuations',
      strategy: 'Focus on strong subjects while maintaining minimum in weak areas'
    };
  };

  const suggestNextSteps = (data) => {
    const title = data?.title?.toLowerCase() || '';
    
    if (title.includes('result') || title.includes('selected')) {
      return [
        'Document verification preparation',
        'Medical examination scheduling',
        'Character verification process',
        'Joining formalities completion',
        'Training program preparation'
      ];
    }
    
    return [
      'Check detailed scorecard analysis',
      'Compare performance with cutoffs',
      'Identify improvement areas',
      'Plan for next attempt if needed',
      'Explore alternative opportunities'
    ];
  };

  const provideCareerGuidance = (data) => {
    const title = data?.title?.toLowerCase() || '';
    
    return {
      immediateActions: getImmediateActions(title),
      longTermPlanning: getLongTermPlanning(title),
      alternativeOptions: getAlternativeOptions(title),
      skillDevelopment: getSkillDevelopment(title)
    };
  };

  const getImmediateActions = (title) => {
    return [
      'Download and save result documents',
      'Check for any discrepancies in personal details',
      'Note down important dates and deadlines',
      'Prepare required documents for next phase',
      'Stay updated with official notifications'
    ];
  };

  const getLongTermPlanning = (title) => {
    return [
      'Career progression roadmap planning',
      'Skill enhancement based on job requirements',
      'Professional networking and connections',
      'Continuous learning and certification pursuit',
      'Leadership and management skill development'
    ];
  };

  const getAlternativeOptions = (title) => {
    if (title.includes('bank')) {
      return ['Private sector banking', 'Insurance companies', 'Financial consulting', 'Fintech startups'];
    } else if (title.includes('railway')) {
      return ['Metro services', 'Transport corporations', 'Logistics companies', 'Infrastructure firms'];
    } else if (title.includes('teacher')) {
      return ['Private schools', 'Coaching institutes', 'Online education', 'Corporate training'];
    }
    
    return ['Private sector opportunities', 'Skill-based careers', 'Entrepreneurship', 'Professional courses'];
  };

  const getSkillDevelopment = (title) => {
    return [
      'Digital literacy and computer skills',
      'Communication and soft skills',
      'Industry-specific certifications',
      'Leadership and team management',
      'Problem-solving and analytical thinking'
    ];
  };

  const getDocumentChecklist = (data) => {
    return [
      { document: 'Educational Certificates', status: 'Original + Photocopies', note: 'All marks sheets and degree certificates' },
      { document: 'Category Certificate', status: 'If applicable', note: 'SC/ST/OBC/EWS certificates' },
      { document: 'Medical Certificate', status: 'Recent', note: 'From registered medical practitioner' },
      { document: 'Character Certificate', status: 'Required', note: 'From local magistrate or gazetted officer' },
      { document: 'Photo Identity Proof', status: 'Original + Copy', note: 'Aadhar, PAN, Driving License, etc.' },
      { document: 'Address Proof', status: 'Recent', note: 'Utility bills, bank statement, etc.' },
      { document: 'Passport Size Photos', status: '10-15 copies', note: 'Recent colored photographs' }
    ];
  };

  const getTimelineGuidance = (data) => {
    return {
      immediate: 'First 7 days after result',
      shortTerm: 'Next 30 days',
      mediumTerm: 'Next 3 months',
      actions: {
        immediate: ['Download result', 'Check details', 'Prepare documents'],
        shortTerm: ['Complete verification', 'Medical checkup', 'Join training'],
        mediumTerm: ['Complete probation', 'Settle into role', 'Plan career growth']
      }
    };
  };

  const analysis = generateResultAnalysis();

  return (
    <div className="result-analysis">
      <h2>📊 Comprehensive Result Analysis</h2>
      <p className="analysis-intro">
        Detailed analysis of the examination results with insights, trends, and guidance for your next steps.
      </p>

      <div className="performance-section">
        <h3>📈 Performance Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <h4>Total Applicants</h4>
            <span className="metric-value">{analysis.performanceMetrics.totalCandidates}</span>
          </div>
          <div className="metric-card">
            <h4>Qualified Candidates</h4>
            <span className="metric-value">{analysis.performanceMetrics.qualifiedCandidates}</span>
          </div>
          <div className="metric-card">
            <h4>Selection Ratio</h4>
            <span className="metric-value">{analysis.performanceMetrics.selectionRatio}</span>
          </div>
        </div>
        
        <div className="performance-factors">
          <h4>Key Performance Factors</h4>
          <ul>
            {analysis.performanceMetrics.performanceFactors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="trends-section">
        <h3>📊 Trend Analysis</h3>
        <div className="trend-cards">
          <div className="trend-card">
            <h4>Cutoff Trends</h4>
            <div className="trend-info">
              <span className={`trend-indicator ${analysis.trendAnalysis.cutoffTrends.trend.toLowerCase()}`}>
                {analysis.trendAnalysis.cutoffTrends.trend}
              </span>
              <span className="trend-change">{analysis.trendAnalysis.cutoffTrends.change}</span>
            </div>
            <p>{analysis.trendAnalysis.cutoffTrends.reason}</p>
          </div>
          
          <div className="trend-card">
            <h4>Competition Level</h4>
            <div className="competition-info">
              <span className="competition-level">{analysis.trendAnalysis.competitionLevel.level}</span>
              <span className="competition-factor">{analysis.trendAnalysis.competitionLevel.factor}</span>
            </div>
          </div>
        </div>
        
        <div className="future-predictions">
          <h4>Future Predictions</h4>
          <ul>
            {analysis.trendAnalysis.futurePredictions.map((prediction, index) => (
              <li key={index}>{prediction}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="cutoffs-section">
        <h3>🎯 Cutoff Analysis</h3>
        <div className="cutoff-tables">
          <div className="category-cutoffs">
            <h4>Category-wise Expected Cutoffs</h4>
            <div className="cutoff-grid">
              {analysis.cutoffAnalysis.categoryWise.map((cutoff, index) => (
                <div key={index} className="cutoff-card">
                  <h5>{cutoff.category}</h5>
                  <span className="cutoff-range">{cutoff.range}</span>
                  <p>{cutoff.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="sectional-cutoffs">
            <h4>Sectional Cutoffs</h4>
            <div className="section-grid">
              {analysis.cutoffAnalysis.sectionalCutoffs.map((section, index) => (
                <div key={index} className="section-card">
                  <h5>{section.section}</h5>
                  <span className="section-cutoff">{section.cutoff}</span>
                  <p className="section-tip">{section.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="next-steps-section">
        <h3>🚀 Next Steps Guidance</h3>
        <div className="steps-list">
          {analysis.nextSteps.map((step, index) => (
            <div key={index} className="step-item">
              <span className="step-number">{index + 1}</span>
              <span className="step-text">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="career-guidance-section">
        <h3>💼 Career Guidance</h3>
        <div className="guidance-grid">
          <div className="guidance-card">
            <h4>Immediate Actions</h4>
            <ul>
              {analysis.careerGuidance.immediateActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
          
          <div className="guidance-card">
            <h4>Alternative Options</h4>
            <ul>
              {analysis.careerGuidance.alternativeOptions.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          </div>
          
          <div className="guidance-card">
            <h4>Skill Development</h4>
            <ul>
              {analysis.careerGuidance.skillDevelopment.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="documents-section">
        <h3>📋 Document Checklist</h3>
        <div className="documents-list">
          {analysis.documentChecklist.map((doc, index) => (
            <div key={index} className="document-item">
              <h5>{doc.document}</h5>
              <span className="doc-status">{doc.status}</span>
              <p className="doc-note">{doc.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="timeline-section">
        <h3>⏰ Timeline Guidance</h3>
        <div className="timeline-phases">
          <div className="timeline-phase">
            <h4>{analysis.timelineGuidance.immediate}</h4>
            <ul>
              {analysis.timelineGuidance.actions.immediate.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
          
          <div className="timeline-phase">
            <h4>{analysis.timelineGuidance.shortTerm}</h4>
            <ul>
              {analysis.timelineGuidance.actions.shortTerm.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
          
          <div className="timeline-phase">
            <h4>{analysis.timelineGuidance.mediumTerm}</h4>
            <ul>
              {analysis.timelineGuidance.actions.mediumTerm.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultAnalysis;
