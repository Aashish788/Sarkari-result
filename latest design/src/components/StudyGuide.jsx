import React from 'react';
import './StudyGuide.css';

const StudyGuide = ({ jobData, examType = 'general' }) => {
  // Generate comprehensive study guide based on job/exam type
  const generateStudyGuide = () => {
    const title = jobData?.title?.toLowerCase() || '';
    
    return {
      studyPlan: createStudyPlan(title),
      subjectWiseStrategy: getSubjectStrategy(title),
      bookRecommendations: getBookRecommendations(title),
      onlineResources: getOnlineResources(title),
      mockTestStrategy: getMockTestStrategy(title),
      revisionTechniques: getRevisionTechniques(),
      timeManagement: getTimeManagementTips(),
      motivationalTips: getMotivationalTips(),
      examDayStrategy: getExamDayStrategy(),
      commonErrors: getCommonErrors(title)
    };
  };

  const createStudyPlan = (title) => {
    if (title.includes('ssc') || title.includes('bank')) {
      return {
        duration: '6 months',
        phases: [
          {
            phase: 'Foundation Building (Month 1-2)',
            focus: 'Concept Clarity and Basic Understanding',
            subjects: ['Mathematics basics', 'English grammar', 'Reasoning fundamentals', 'General awareness'],
            dailyHours: '4-5 hours',
            weeklyTarget: 'Complete 2-3 chapters per subject'
          },
          {
            phase: 'Skill Enhancement (Month 3-4)',
            focus: 'Advanced Problem Solving and Speed Building',
            subjects: ['Advanced quantitative techniques', 'Complex reasoning patterns', 'Reading comprehension', 'Current affairs'],
            dailyHours: '5-6 hours',
            weeklyTarget: 'Solve 200+ questions per subject'
          },
          {
            phase: 'Mock Test Phase (Month 5)',
            focus: 'Full-length Tests and Performance Analysis',
            subjects: ['All subjects integrated', 'Sectional tests', 'Time-bound practice', 'Weak area focus'],
            dailyHours: '6-7 hours',
            weeklyTarget: '3-4 full-length mock tests'
          },
          {
            phase: 'Final Preparation (Month 6)',
            focus: 'Revision and Confidence Building',
            subjects: ['Formula revision', 'Quick review notes', 'Previous year papers', 'Last-minute tips'],
            dailyHours: '7-8 hours',
            weeklyTarget: 'Daily revision + 2 mock tests'
          }
        ]
      };
    } else if (title.includes('upsc')) {
      return {
        duration: '12-15 months',
        phases: [
          {
            phase: 'Foundation Phase (Month 1-4)',
            focus: 'NCERT and Basic Concepts',
            subjects: ['NCERT 6-12 all subjects', 'Basic current affairs', 'Optional subject introduction'],
            dailyHours: '8-10 hours',
            weeklyTarget: 'Complete 1 NCERT book per week'
          },
          {
            phase: 'Building Phase (Month 5-9)',
            focus: 'Standard Books and Current Affairs',
            subjects: ['Standard reference books', 'Newspaper reading', 'Optional preparation', 'Answer writing practice'],
            dailyHours: '10-12 hours',
            weeklyTarget: '2-3 topics completion + daily current affairs'
          },
          {
            phase: 'Testing Phase (Month 10-12)',
            focus: 'Mock Tests and Answer Writing',
            subjects: ['All subjects revision', 'Mock test series', 'Answer writing improvement', 'Interview preparation'],
            dailyHours: '12-14 hours',
            weeklyTarget: '2 mock tests + daily answer writing'
          },
          {
            phase: 'Final Phase (Month 13-15)',
            focus: 'Consolidation and Fine-tuning',
            subjects: ['Final revision', 'Current affairs compilation', 'Mock interviews', 'Stress management'],
            dailyHours: '10-12 hours',
            weeklyTarget: 'Complete subject revision cycle'
          }
        ]
      };
    }
    
    return {
      duration: '4-6 months',
      phases: [
        {
          phase: 'Preparation Phase (Month 1-3)',
          focus: 'Core Concepts and Practice',
          subjects: ['Subject fundamentals', 'Basic problem solving', 'General knowledge', 'Current affairs'],
          dailyHours: '3-4 hours',
          weeklyTarget: 'Complete 1-2 chapters per subject'
        },
        {
          phase: 'Intensive Phase (Month 4-5)',
          focus: 'Advanced Practice and Speed',
          subjects: ['Complex problems', 'Time-bound tests', 'Mock examinations', 'Weak area improvement'],
          dailyHours: '5-6 hours',
          weeklyTarget: '2 mock tests + targeted practice'
        },
        {
          phase: 'Final Phase (Month 6)',
          focus: 'Revision and Confidence',
          subjects: ['Final revision', 'Quick notes review', 'Previous year papers', 'Exam strategy'],
          dailyHours: '4-5 hours',
          weeklyTarget: 'Daily revision + practice tests'
        }
      ]
    };
  };

  const getSubjectStrategy = (title) => {
    if (title.includes('ssc') || title.includes('bank')) {
      return [
        {
          subject: 'Quantitative Aptitude',
          weightage: '25-30%',
          strategy: 'Focus on speed and accuracy',
          keyTopics: ['Arithmetic', 'Algebra', 'Geometry', 'Data Interpretation'],
          tips: [
            'Practice mental math daily for 30 minutes',
            'Learn shortcuts and vedic math techniques',
            'Focus on high-weightage topics like arithmetic',
            'Maintain a formula sheet for quick revision'
          ],
          timeAllocation: '2 hours daily',
          targetAccuracy: '85-90%'
        },
        {
          subject: 'Reasoning Ability',
          weightage: '25-30%',
          strategy: 'Pattern recognition and logical thinking',
          keyTopics: ['Seating Arrangement', 'Puzzles', 'Syllogism', 'Coding-Decoding'],
          tips: [
            'Practice different types of puzzles daily',
            'Develop systematic approach for seating arrangements',
            'Master basic reasoning concepts first',
            'Use elimination techniques in multiple choice'
          ],
          timeAllocation: '1.5 hours daily',
          targetAccuracy: '90-95%'
        },
        {
          subject: 'English Language',
          weightage: '25%',
          strategy: 'Grammar mastery and vocabulary building',
          keyTopics: ['Grammar', 'Reading Comprehension', 'Vocabulary', 'Error Spotting'],
          tips: [
            'Read newspapers daily for vocabulary',
            'Practice grammar rules with examples',
            'Improve reading speed for comprehension',
            'Learn common error patterns'
          ],
          timeAllocation: '1 hour daily',
          targetAccuracy: '80-85%'
        },
        {
          subject: 'General Awareness',
          weightage: '20-25%',
          strategy: 'Current affairs and static knowledge',
          keyTopics: ['Current Affairs', 'Banking Awareness', 'History', 'Geography'],
          tips: [
            'Read current affairs daily from reliable sources',
            'Maintain monthly current affairs notes',
            'Focus on banking and financial awareness',
            'Practice previous year GA questions'
          ],
          timeAllocation: '45 minutes daily',
          targetAccuracy: '75-80%'
        }
      ];
    }
    
    return [
      {
        subject: 'Core Subject',
        weightage: '40-50%',
        strategy: 'Deep conceptual understanding',
        keyTopics: ['Fundamentals', 'Advanced concepts', 'Problem solving', 'Applications'],
        tips: [
          'Build strong foundation in basics',
          'Practice variety of problems',
          'Understand application scenarios',
          'Regular revision of concepts'
        ],
        timeAllocation: '2-3 hours daily',
        targetAccuracy: '85%+'
      }
    ];
  };

  const getBookRecommendations = (title) => {
    if (title.includes('ssc')) {
      return {
        quantitativeAptitude: [
          { book: 'Quantitative Aptitude by R.S. Aggarwal', level: 'Beginner', rating: 4.5 },
          { book: 'Fast Track Objective Arithmetic by Rajesh Verma', level: 'Advanced', rating: 4.8 },
          { book: 'Quantum CAT by Sarvesh K. Verma', level: 'Expert', rating: 4.7 }
        ],
        reasoning: [
          { book: 'A Modern Approach to Verbal & Non-Verbal Reasoning by R.S. Aggarwal', level: 'All levels', rating: 4.6 },
          { book: 'Analytical Reasoning by M.K. Pandey', level: 'Advanced', rating: 4.4 },
          { book: 'Reasoning by Arun Sharma', level: 'Expert', rating: 4.3 }
        ],
        english: [
          { book: 'Objective General English by S.P. Bakshi', level: 'Beginner', rating: 4.2 },
          { book: 'Word Power Made Easy by Norman Lewis', level: 'All levels', rating: 4.7 },
          { book: 'High School English Grammar by Wren & Martin', level: 'Foundation', rating: 4.8 }
        ],
        generalStudies: [
          { book: 'General Studies Manual by McGraw Hill', level: 'All levels', rating: 4.4 },
          { book: 'Lucent\'s General Knowledge', level: 'Beginner', rating: 4.3 },
          { book: 'Manorama Yearbook', level: 'Current Affairs', rating: 4.5 }
        ]
      };
    } else if (title.includes('bank')) {
      return {
        quantitativeAptitude: [
          { book: 'Quantitative Aptitude by R.S. Aggarwal', level: 'Foundation', rating: 4.5 },
          { book: 'Quantitative Aptitude by Arun Sharma', level: 'Advanced', rating: 4.6 }
        ],
        reasoning: [
          { book: 'A Modern Approach to Verbal Reasoning by R.S. Aggarwal', level: 'All levels', rating: 4.6 },
          { book: 'Reasoning by Arun Sharma', level: 'Advanced', rating: 4.4 }
        ],
        english: [
          { book: 'Objective General English by S.P. Bakshi', level: 'Foundation', rating: 4.2 },
          { book: 'Word Power Made Easy by Norman Lewis', level: 'Vocabulary', rating: 4.7 }
        ],
        bankingAwareness: [
          { book: 'Banking Awareness by Arihant Publications', level: 'All levels', rating: 4.3 },
          { book: 'Indian Banking System by K.C. Shekhar', level: 'Advanced', rating: 4.4 }
        ]
      };
    }
    
    return {
      coreSubject: [
        { book: 'Standard Textbooks for the subject', level: 'Foundation', rating: 4.0 },
        { book: 'Previous Year Question Papers', level: 'Practice', rating: 4.5 }
      ]
    };
  };

  const getOnlineResources = (title) => {
    return [
      {
        platform: 'YouTube Channels',
        resources: [
          'Unacademy Banking',
          'Study IQ Education',
          'Adda247',
          'Gradeup',
          'Career Definer'
        ],
        type: 'Free Video Lectures'
      },
      {
        platform: 'Mobile Apps',
        resources: [
          'Gradeup App',
          'Adda247 App',
          'Testbook App',
          'Oliveboard App',
          'BYJU\'S Exam Prep'
        ],
        type: 'Practice & Mock Tests'
      },
      {
        platform: 'Websites',
        resources: [
          'Jagran Josh',
          'SarkariExam.com',
          'FreshersNow',
          'AffairsCloud',
          'GKToday'
        ],
        type: 'Current Affairs & GK'
      },
      {
        platform: 'Paid Courses',
        resources: [
          'Unacademy Plus',
          'BYJU\'S Exam Prep',
          'Testbook Pass',
          'Oliveboard Premium',
          'Career Power'
        ],
        type: 'Comprehensive Courses'
      }
    ];
  };

  const getMockTestStrategy = (title) => {
    return {
      schedule: [
        {
          phase: 'Initial Phase',
          frequency: '1 test per week',
          focus: 'Familiarization with exam pattern',
          duration: 'First 2 months'
        },
        {
          phase: 'Building Phase',
          frequency: '2 tests per week',
          focus: 'Speed building and accuracy improvement',
          duration: 'Next 2-3 months'
        },
        {
          phase: 'Intensive Phase',
          frequency: '1 test daily',
          focus: 'Final preparation and confidence building',
          duration: 'Last month'
        }
      ],
      analysisStrategy: [
        'Spend 2x time on analysis than taking the test',
        'Identify and categorize all mistakes',
        'Focus on time management per section',
        'Track improvement in accuracy and speed',
        'Maintain a mistake journal for revision'
      ],
      testTypes: [
        'Full-length Mock Tests',
        'Subject-wise Sectional Tests',
        'Previous Year Paper Tests',
        'Speed Tests (15-20 minutes)',
        'Difficulty-based Tests'
      ]
    };
  };

  const getRevisionTechniques = () => {
    return [
      {
        technique: 'Spaced Repetition',
        description: 'Review topics at increasing intervals',
        implementation: 'Day 1, Day 3, Day 7, Day 15, Day 30',
        effectiveness: 'Excellent for long-term retention'
      },
      {
        technique: 'Active Recall',
        description: 'Test yourself without looking at notes',
        implementation: 'Close books and explain concepts aloud',
        effectiveness: 'Builds strong neural connections'
      },
      {
        technique: 'Mind Mapping',
        description: 'Visual representation of topics and connections',
        implementation: 'Create topic-wise mind maps with colors',
        effectiveness: 'Great for visual learners'
      },
      {
        technique: 'Pomodoro Technique',
        description: '25 minutes focused study + 5 minute break',
        implementation: 'Use timer for structured study sessions',
        effectiveness: 'Maintains high concentration levels'
      },
      {
        technique: 'Teach to Learn',
        description: 'Explain concepts to others or to yourself',
        implementation: 'Record yourself explaining or teach friends',
        effectiveness: 'Identifies knowledge gaps quickly'
      }
    ];
  };

  const getTimeManagementTips = () => {
    return [
      {
        category: 'Daily Schedule',
        tips: [
          'Wake up early and start with the toughest subject',
          'Allocate specific time slots for each subject',
          'Take regular breaks to avoid mental fatigue',
          'Include physical exercise in daily routine'
        ]
      },
      {
        category: 'Study Sessions',
        tips: [
          'Follow 25-minute focused study blocks',
          'Eliminate all distractions during study time',
          'Use active learning techniques like note-taking',
          'End each session by planning the next one'
        ]
      },
      {
        category: 'Weekly Planning',
        tips: [
          'Plan weekly targets for each subject',
          'Reserve Sundays for complete revision',
          'Include one full-length mock test per week',
          'Review and adjust plan based on performance'
        ]
      },
      {
        category: 'Exam Time Management',
        tips: [
          'Attempt easier questions first to build confidence',
          'Allocate time per section based on marks',
          'Keep buffer time for review and corrections',
          'Don\'t spend too much time on any single question'
        ]
      }
    ];
  };

  const getMotivationalTips = () => {
    return [
      {
        aspect: 'Goal Setting',
        tips: [
          'Set both short-term and long-term goals',
          'Write down your goals and place them where you can see daily',
          'Celebrate small achievements to maintain motivation',
          'Visualize your success regularly'
        ]
      },
      {
        aspect: 'Handling Pressure',
        tips: [
          'Practice meditation or deep breathing exercises',
          'Maintain a positive social circle',
          'Take regular breaks and pursue hobbies',
          'Remember that failure is part of the learning process'
        ]
      },
      {
        aspect: 'Staying Focused',
        tips: [
          'Create a dedicated study environment',
          'Turn off phone notifications during study hours',
          'Use apps to block distracting websites',
          'Set daily and weekly targets to track progress'
        ]
      },
      {
        aspect: 'Building Confidence',
        tips: [
          'Review your progress regularly',
          'Learn from mistakes without being harsh on yourself',
          'Practice positive self-talk',
          'Surround yourself with supportive people'
        ]
      }
    ];
  };

  const getExamDayStrategy = () => {
    return {
      dayBefore: [
        'Complete light revision, no new topics',
        'Keep all documents and stationery ready',
        'Get adequate sleep (7-8 hours)',
        'Eat healthy and stay hydrated'
      ],
      examDay: [
        'Reach venue 30-45 minutes early',
        'Carry water bottle and light snacks',
        'Do breathing exercises to calm nerves',
        'Read instructions carefully before starting'
      ],
      duringExam: [
        'Start with easier questions to build momentum',
        'Keep track of time for each section',
        'Mark questions you\'re unsure about for review',
        'Stay calm if you encounter difficult questions'
      ],
      afterExam: [
        'Don\'t discuss answers with other candidates',
        'Avoid overthinking about performance',
        'Focus on preparing for next stage if applicable',
        'Take some time to relax and recharge'
      ]
    };
  };

  const getCommonErrors = (title) => {
    return [
      {
        error: 'Inconsistent Study Schedule',
        impact: 'Leads to incomplete preparation',
        solution: 'Create and stick to a realistic timetable'
      },
      {
        error: 'Ignoring Mock Test Analysis',
        impact: 'Repeating same mistakes',
        solution: 'Spend quality time analyzing each mock test'
      },
      {
        error: 'Focusing Only on Strong Subjects',
        impact: 'Weak subjects remain weak',
        solution: 'Allocate more time to weak areas'
      },
      {
        error: 'Last-minute Cramming',
        impact: 'Increased stress and poor retention',
        solution: 'Start preparation early and revise regularly'
      },
      {
        error: 'Neglecting Current Affairs',
        impact: 'Poor performance in GK section',
        solution: 'Daily current affairs reading and notes'
      },
      {
        error: 'Not Managing Exam Time',
        impact: 'Unable to attempt all questions',
        solution: 'Practice time-bound tests regularly'
      },
      {
        error: 'Comparing with Others',
        impact: 'Unnecessary stress and demotivation',
        solution: 'Focus on personal improvement and goals'
      }
    ];
  };

  const guide = generateStudyGuide();

  return (
    <div className="study-guide">
      <h2>📚 Complete Study Guide & Strategy</h2>
      <p className="guide-intro">
        A comprehensive study guide crafted by experts to help you prepare systematically and efficiently for this examination.
      </p>

      <div className="study-plan-section">
        <h3>📅 Strategic Study Plan</h3>
        <div className="study-plan">
          <div className="plan-overview">
            <h4>Total Duration: {guide.studyPlan.duration}</h4>
            <p>Structured approach to cover all topics systematically</p>
          </div>
          
          <div className="phases-timeline">
            {guide.studyPlan.phases.map((phase, index) => (
              <div key={index} className="phase-card">
                <h4>{phase.phase}</h4>
                <div className="phase-focus">{phase.focus}</div>
                <div className="phase-details">
                  <div className="phase-subjects">
                    <strong>Key Areas:</strong>
                    <ul>
                      {phase.subjects.map((subject, idx) => (
                        <li key={idx}>{subject}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="phase-commitment">
                    <span className="daily-hours">Daily: {phase.dailyHours}</span>
                    <span className="weekly-target">Target: {phase.weeklyTarget}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="subject-strategy-section">
        <h3>🎯 Subject-wise Strategy</h3>
        <div className="subjects-grid">
          {guide.subjectWiseStrategy.map((subject, index) => (
            <div key={index} className="subject-strategy-card">
              <h4>{subject.subject}</h4>
              <div className="subject-meta">
                <span className="weightage">Weightage: {subject.weightage}</span>
                <span className="accuracy">Target: {subject.targetAccuracy}</span>
                <span className="time">Daily: {subject.timeAllocation}</span>
              </div>
              <p className="strategy">{subject.strategy}</p>
              
              <div className="key-topics">
                <strong>Key Topics:</strong>
                <div className="topics-list">
                  {subject.keyTopics.map((topic, idx) => (
                    <span key={idx} className="topic-tag">{topic}</span>
                  ))}
                </div>
              </div>
              
              <div className="subject-tips">
                <strong>Expert Tips:</strong>
                <ul>
                  {subject.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="books-section">
        <h3>📖 Recommended Books</h3>
        <div className="books-categories">
          {Object.entries(guide.bookRecommendations).map(([category, books]) => (
            <div key={category} className="book-category">
              <h4>{category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
              <div className="books-list">
                {books.map((book, index) => (
                  <div key={index} className="book-item">
                    <h5>{book.book}</h5>
                    <div className="book-meta">
                      <span className={`book-level ${book.level.toLowerCase()}`}>{book.level}</span>
                      <span className="book-rating">
                        {'★'.repeat(Math.floor(book.rating))} {book.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="online-resources-section">
        <h3>💻 Online Resources</h3>
        <div className="resources-grid">
          {guide.onlineResources.map((resource, index) => (
            <div key={index} className="resource-category">
              <h4>{resource.platform}</h4>
              <span className="resource-type">{resource.type}</span>
              <ul>
                {resource.resources.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mock-test-section">
        <h3>📝 Mock Test Strategy</h3>
        <div className="mock-strategy">
          <div className="mock-schedule">
            <h4>Testing Schedule</h4>
            {guide.mockTestStrategy.schedule.map((phase, index) => (
              <div key={index} className="mock-phase">
                <h5>{phase.phase}</h5>
                <div className="mock-details">
                  <span>Frequency: {phase.frequency}</span>
                  <span>Duration: {phase.duration}</span>
                  <p>{phase.focus}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="analysis-strategy">
            <h4>Analysis Strategy</h4>
            <ul>
              {guide.mockTestStrategy.analysisStrategy.map((strategy, index) => (
                <li key={index}>{strategy}</li>
              ))}
            </ul>
          </div>
          
          <div className="test-types">
            <h4>Types of Tests</h4>
            <div className="test-types-grid">
              {guide.mockTestStrategy.testTypes.map((type, index) => (
                <span key={index} className="test-type-tag">{type}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="revision-section">
        <h3>🔄 Revision Techniques</h3>
        <div className="revision-techniques">
          {guide.revisionTechniques.map((technique, index) => (
            <div key={index} className="technique-card">
              <h4>{technique.technique}</h4>
              <p className="technique-description">{technique.description}</p>
              <div className="technique-details">
                <span className="implementation">How: {technique.implementation}</span>
                <span className="effectiveness">Effect: {technique.effectiveness}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="time-management-section">
        <h3>⏰ Time Management</h3>
        <div className="time-categories">
          {guide.timeManagement.map((category, index) => (
            <div key={index} className="time-category">
              <h4>{category.category}</h4>
              <ul>
                {category.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="motivation-section">
        <h3>💪 Motivation & Mental Preparation</h3>
        <div className="motivation-aspects">
          {guide.motivationalTips.map((aspect, index) => (
            <div key={index} className="motivation-card">
              <h4>{aspect.aspect}</h4>
              <ul>
                {aspect.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="exam-day-section">
        <h3>📋 Exam Day Strategy</h3>
        <div className="exam-phases">
          {Object.entries(guide.examDayStrategy).map(([phase, actions]) => (
            <div key={phase} className="exam-phase">
              <h4>{phase.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
              <ul>
                {actions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="common-errors-section">
        <h3>⚠️ Common Errors to Avoid</h3>
        <div className="errors-list">
          {guide.commonErrors.map((error, index) => (
            <div key={index} className="error-card">
              <h4>{error.error}</h4>
              <div className="error-impact">Impact: {error.impact}</div>
              <div className="error-solution">Solution: {error.solution}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyGuide;
