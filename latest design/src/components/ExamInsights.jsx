import React from 'react';
import './ExamInsights.css';

const ExamInsights = ({ examData, examType = 'general' }) => {
  // Generate comprehensive exam insights
  const generateInsights = () => {
    const insights = {
      difficultyAnalysis: analyzeDifficulty(examData),
      cutoffPrediction: predictCutoff(examData),
      subjectBreakdown: analyzeSubjects(examData),
      preparationTimeline: suggestTimeline(examData),
      expertTips: getExpertTips(examData, examType),
      commonMistakes: getCommonMistakes(examType),
      successStories: getSuccessStories(examType)
    };
    return insights;
  };

  const analyzeDifficulty = (data) => {
    const title = data?.title?.toLowerCase() || '';
    
    if (title.includes('upsc') || title.includes('ias') || title.includes('ips')) {
      return {
        level: 'Very High',
        description: 'Requires extensive preparation across multiple subjects',
        factors: ['Vast syllabus', 'Multiple stages', 'Interview round', 'Essay writing']
      };
    } else if (title.includes('ssc') || title.includes('bank po')) {
      return {
        level: 'High',
        description: 'Competitive with focus on aptitude and reasoning',
        factors: ['Quantitative aptitude', 'Logical reasoning', 'English proficiency', 'Current affairs']
      };
    } else if (title.includes('clerk') || title.includes('assistant')) {
      return {
        level: 'Moderate',
        description: 'Good preparation can secure selection',
        factors: ['Basic mathematics', 'English grammar', 'General awareness', 'Computer knowledge']
      };
    }
    
    return {
      level: 'Moderate',
      description: 'Systematic preparation leads to success',
      factors: ['Subject knowledge', 'Practice tests', 'Time management', 'Current affairs']
    };
  };

  const predictCutoff = (data) => {
    const title = data?.title?.toLowerCase() || '';
    
    if (title.includes('general') || title.includes('unreserved')) {
      return { category: 'General', range: '85-95%', trend: 'High due to competition' };
    } else if (title.includes('obc')) {
      return { category: 'OBC', range: '80-90%', trend: 'Moderate competition' };
    } else if (title.includes('sc')) {
      return { category: 'SC', range: '70-80%', trend: 'Relaxed cutoff' };
    } else if (title.includes('st')) {
      return { category: 'ST', range: '65-75%', trend: 'Relaxed cutoff' };
    }
    
    return { category: 'All Categories', range: '75-85%', trend: 'Varies by category' };
  };

  const analyzeSubjects = (data) => {
    const title = data?.title?.toLowerCase() || '';
    
    if (title.includes('bank') || title.includes('clerk')) {
      return [
        { subject: 'Quantitative Aptitude', weightage: '25%', difficulty: 'High', tips: 'Focus on speed and accuracy' },
        { subject: 'Reasoning Ability', weightage: '25%', difficulty: 'Moderate', tips: 'Practice puzzles and seating arrangement' },
        { subject: 'English Language', weightage: '25%', difficulty: 'Moderate', tips: 'Grammar and reading comprehension' },
        { subject: 'General Awareness', weightage: '25%', difficulty: 'Easy', tips: 'Current affairs and banking knowledge' }
      ];
    } else if (title.includes('ssc')) {
      return [
        { subject: 'General Intelligence', weightage: '25%', difficulty: 'Moderate', tips: 'Logical reasoning and puzzles' },
        { subject: 'Quantitative Aptitude', weightage: '25%', difficulty: 'High', tips: 'Mathematical concepts and shortcuts' },
        { subject: 'English Comprehension', weightage: '25%', difficulty: 'Moderate', tips: 'Vocabulary and grammar' },
        { subject: 'General Studies', weightage: '25%', difficulty: 'Easy', tips: 'History, geography, and current events' }
      ];
    } else if (title.includes('railway')) {
      return [
        { subject: 'Mathematics', weightage: '30%', difficulty: 'High', tips: 'Arithmetic and algebra focus' },
        { subject: 'General Intelligence', weightage: '25%', difficulty: 'Moderate', tips: 'Reasoning and logical thinking' },
        { subject: 'General Science', weightage: '25%', difficulty: 'Moderate', tips: 'Physics, chemistry, biology basics' },
        { subject: 'General Awareness', weightage: '20%', difficulty: 'Easy', tips: 'Current affairs and Indian history' }
      ];
    }
    
    return [
      { subject: 'Core Subject', weightage: '40%', difficulty: 'High', tips: 'Master fundamentals thoroughly' },
      { subject: 'Aptitude', weightage: '30%', difficulty: 'Moderate', tips: 'Practice numerical problems' },
      { subject: 'General Knowledge', weightage: '30%', difficulty: 'Easy', tips: 'Stay updated with current affairs' }
    ];
  };

  const suggestTimeline = (data) => {
    const title = data?.title?.toLowerCase() || '';
    
    if (title.includes('upsc') || title.includes('ias')) {
      return {
        total: '12-18 months',
        phases: [
          { phase: 'Foundation', duration: '3-4 months', focus: 'NCERT and basic concepts' },
          { phase: 'Preparation', duration: '6-8 months', focus: 'Advanced books and current affairs' },
          { phase: 'Revision', duration: '2-3 months', focus: 'Mock tests and answer writing' },
          { phase: 'Final Prep', duration: '1 month', focus: 'Last-minute revision' }
        ]
      };
    } else if (title.includes('bank') || title.includes('ssc')) {
      return {
        total: '6-9 months',
        phases: [
          { phase: 'Foundation', duration: '2 months', focus: 'Basic concepts and formulas' },
          { phase: 'Practice', duration: '3-4 months', focus: 'Sectional tests and speed building' },
          { phase: 'Mock Tests', duration: '1-2 months', focus: 'Full-length tests and analysis' },
          { phase: 'Revision', duration: '1 month', focus: 'Weak areas and final touches' }
        ]
      };
    }
    
    return {
      total: '4-6 months',
      phases: [
        { phase: 'Preparation', duration: '2-3 months', focus: 'Concept building' },
        { phase: 'Practice', duration: '1-2 months', focus: 'Problem solving' },
        { phase: 'Final Prep', duration: '1 month', focus: 'Revision and mock tests' }
      ]
    };
  };

  const getExpertTips = (data, type) => {
    return [
      {
        category: 'Study Strategy',
        tips: [
          'Create a daily study schedule and stick to it religiously',
          'Focus on understanding concepts rather than rote memorization',
          'Practice previous year questions to understand exam patterns'
        ]
      },
      {
        category: 'Time Management',
        tips: [
          'Allocate specific time slots for each subject daily',
          'Use the Pomodoro technique for focused study sessions',
          'Take regular breaks to maintain concentration levels'
        ]
      },
      {
        category: 'Mock Test Strategy',
        tips: [
          'Start taking mock tests 2 months before the exam',
          'Analyze your performance after each mock test',
          'Work on improving accuracy before focusing on speed'
        ]
      },
      {
        category: 'Exam Day Tips',
        tips: [
          'Attempt easier questions first to build confidence',
          'Keep track of time and don\'t get stuck on difficult questions',
          'Review your answers if time permits before submission'
        ]
      }
    ];
  };

  const getCommonMistakes = (type) => {
    return [
      'Neglecting to read instructions carefully',
      'Poor time management during the exam',
      'Not practicing enough mock tests',
      'Ignoring negative marking while guessing',
      'Focusing only on strong subjects',
      'Last-minute cramming instead of revision',
      'Not maintaining exam temperament',
      'Overlooking current affairs preparation'
    ];
  };

  const getSuccessStories = (type) => {
    return [
      {
        name: 'Rajesh Kumar',
        achievement: 'SBI PO 2024',
        tip: 'Consistent daily practice and mock test analysis were key to my success.'
      },
      {
        name: 'Priya Sharma',
        achievement: 'SSC CGL 2024',
        tip: 'Focus on accuracy first, speed comes naturally with practice.'
      },
      {
        name: 'Amit Singh',
        achievement: 'Railway Group D',
        tip: 'Current affairs and general knowledge make a huge difference in final scores.'
      }
    ];
  };

  const insights = generateInsights();

  return (
    <div className="exam-insights">
      <h2>🎯 Complete Exam Analysis & Success Guide</h2>
      <p className="insights-intro">
        Get expert analysis and proven strategies to maximize your chances of success in this examination.
      </p>

      <div className="difficulty-section">
        <h3>📊 Difficulty Analysis</h3>
        <div className={`difficulty-card ${insights.difficultyAnalysis.level.toLowerCase().replace(' ', '-')}`}>
          <div className="difficulty-header">
            <span className="difficulty-level">{insights.difficultyAnalysis.level}</span>
            <span className="difficulty-description">{insights.difficultyAnalysis.description}</span>
          </div>
          <div className="difficulty-factors">
            <h4>Key Challenge Areas:</h4>
            <ul>
              {insights.difficultyAnalysis.factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="cutoff-section">
        <h3>🎯 Cutoff Prediction</h3>
        <div className="cutoff-card">
          <div className="cutoff-info">
            <span className="cutoff-category">{insights.cutoffPrediction.category}</span>
            <span className="cutoff-range">{insights.cutoffPrediction.range}</span>
          </div>
          <p className="cutoff-trend">{insights.cutoffPrediction.trend}</p>
        </div>
      </div>

      <div className="subjects-section">
        <h3>📚 Subject-wise Breakdown</h3>
        <div className="subjects-grid">
          {insights.subjectBreakdown.map((subject, index) => (
            <div key={index} className="subject-card">
              <h4>{subject.subject}</h4>
              <div className="subject-details">
                <span className="weightage">Weightage: {subject.weightage}</span>
                <span className={`difficulty ${subject.difficulty.toLowerCase()}`}>
                  {subject.difficulty}
                </span>
              </div>
              <p className="subject-tip">{subject.tips}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="timeline-section">
        <h3>⏰ Preparation Timeline</h3>
        <div className="timeline-card">
          <h4>Recommended Duration: {insights.preparationTimeline.total}</h4>
          <div className="timeline-phases">
            {insights.preparationTimeline.phases.map((phase, index) => (
              <div key={index} className="phase-card">
                <div className="phase-header">
                  <span className="phase-name">{phase.phase}</span>
                  <span className="phase-duration">{phase.duration}</span>
                </div>
                <p className="phase-focus">{phase.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tips-section">
        <h3>💡 Expert Success Tips</h3>
        <div className="tips-grid">
          {insights.expertTips.map((category, index) => (
            <div key={index} className="tip-category">
              <h4>{category.category}</h4>
              <ul>
                {category.tips.map((tip, tipIndex) => (
                  <li key={tipIndex}>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mistakes-section">
        <h3>⚠️ Common Mistakes to Avoid</h3>
        <div className="mistakes-list">
          {insights.commonMistakes.map((mistake, index) => (
            <div key={index} className="mistake-item">
              <span className="mistake-number">{index + 1}</span>
              <span className="mistake-text">{mistake}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="success-stories">
        <h3>🏆 Success Stories</h3>
        <div className="stories-grid">
          {insights.successStories.map((story, index) => (
            <div key={index} className="story-card">
              <h4>{story.name}</h4>
              <span className="achievement">{story.achievement}</span>
              <p className="story-tip">"{story.tip}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamInsights;
