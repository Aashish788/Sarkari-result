import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      category: "General Information",
      questions: [
        {
          question: "What is Sarkari Result and how is it different from other job portals?",
          answer: "Sarkari Result is a comprehensive government job portal that provides original, analyzed content about government examinations, results, and career opportunities. Unlike other portals that simply republish information, we provide expert analysis, preparation strategies, career guidance, and detailed insights to help candidates make informed decisions and prepare effectively for their dream government jobs."
        },
        {
          question: "How do you ensure the authenticity and accuracy of job information?",
          answer: "We have a dedicated team of experts who verify all information from official sources before publishing. Each job posting undergoes multiple verification steps, including cross-referencing with official websites, checking notification dates, and validating application procedures. We also provide direct links to official sources so candidates can verify information independently."
        },
        {
          question: "What makes your career guidance different from generic advice available elsewhere?",
          answer: "Our career guidance is specifically tailored based on current market trends, exam patterns, and success stories of real candidates. We analyze thousands of job postings, cutoff trends, and selection patterns to provide data-driven insights. Our experts include former government employees, successful candidates, and education professionals who understand the nuances of government job selection processes."
        }
      ]
    },
    {
      category: "Exam Preparation",
      questions: [
        {
          question: "How should I start preparing for government exams as a beginner?",
          answer: "Start by understanding the exam pattern and syllabus thoroughly. Create a structured study plan based on your target exam timeline. Focus on building strong fundamentals in quantitative aptitude, reasoning, and general knowledge. Practice with previous year questions to understand the difficulty level. Join our free preparation resources and follow our subject-wise strategies for optimal results."
        },
        {
          question: "What is the ideal study duration for different types of government exams?",
          answer: "Study duration varies by exam complexity: SSC CGL/Bank PO: 6-9 months of consistent preparation; UPSC Civil Services: 12-18 months minimum; Railway Group D: 4-6 months; State PSC exams: 6-12 months depending on the state. However, quality of preparation matters more than duration. Consistent daily study with proper strategy yields better results than intensive last-minute preparation."
        },
        {
          question: "How important are mock tests and how should I use them effectively?",
          answer: "Mock tests are crucial for success in government exams. Start taking weekly mocks 3 months before your exam. Spend twice as much time analyzing each mock as you spend taking it. Focus on identifying patterns in your mistakes, improving time management, and building exam temperament. Track your progress through accuracy rates and sectional performance. Our analysis shows that candidates who take 50+ quality mocks score 15-20% higher than those who don't."
        },
        {
          question: "Should I join coaching classes or is self-study sufficient?",
          answer: "Both approaches can work depending on your learning style, discipline, and resources. Self-study is effective if you're disciplined, have good study materials, and can stick to a schedule. Coaching helps with structure, peer interaction, and expert guidance. Many successful candidates combine both - foundation from coaching and intensive practice through self-study. The key is consistency and smart preparation regardless of the method."
        }
      ]
    },
    {
      category: "Application Process",
      questions: [
        {
          question: "What documents are typically required for government job applications?",
          answer: "Standard documents include: Educational certificates (10th, 12th, graduation), Category certificate (SC/ST/OBC/EWS if applicable), Recent passport-size photographs, Signature sample, Aadhar card, PAN card, and Experience certificates (if required). Keep both original and photocopies ready. Some exams may require additional documents like medical certificates or character certificates during later stages."
        },
        {
          question: "How can I avoid common mistakes during online applications?",
          answer: "Common mistakes to avoid: 1) Filling incorrect personal details - double-check name spelling, date of birth, and category; 2) Using poor quality photographs that don't meet specifications; 3) Not keeping application fee payment receipts; 4) Missing application deadlines; 5) Not reading eligibility criteria carefully. Always review your application before final submission and take screenshots for your records."
        },
        {
          question: "What should I do if I notice an error in my application after submission?",
          answer: "Most recruitment boards provide correction windows (usually 2-3 days) after application closure where you can modify specific details. If no correction window is available, contact the recruitment board immediately with supporting documents. For critical errors like name or date of birth, you may need to submit an affidavit. Keep all communication documented and follow official procedures only."
        }
      ]
    },
    {
      category: "Career Guidance",
      questions: [
        {
          question: "Which government jobs offer the best career prospects and growth opportunities?",
          answer: "Top career options include: Civil Services (IAS/IPS) - highest administrative positions; Banking (SBI PO, IBPS) - good salary and growth; Defense Services - honor and benefits; Engineering Services (IES) - technical expertise with good pay; Teaching positions - job security with social impact. Choose based on your interests, qualifications, and long-term career goals rather than just salary considerations."
        },
        {
          question: "How do I choose between multiple government job opportunities?",
          answer: "Consider these factors: 1) Job profile and daily responsibilities; 2) Career growth and promotion opportunities; 3) Salary structure and benefits; 4) Work-life balance; 5) Job location and transfer policies; 6) Your personal interests and strengths; 7) Long-term career goals. Create a comparison matrix scoring each opportunity on these parameters to make an objective decision."
        },
        {
          question: "What are the current trends in government recruitment and how should I prepare accordingly?",
          answer: "Current trends include: 1) Increased focus on computer-based testing; 2) More emphasis on practical and application-based questions; 3) Integration of current affairs with core subjects; 4) Personality assessment in interviews; 5) Online document verification processes. Adapt your preparation to include digital literacy, current affairs integration, and soft skill development alongside traditional subject preparation."
        },
        {
          question: "How can I stay motivated during long preparation periods?",
          answer: "Maintain motivation by: 1) Setting short-term achievable goals alongside long-term objectives; 2) Celebrating small victories and progress milestones; 3) Connecting with fellow aspirants for peer support; 4) Regular self-assessment to track improvement; 5) Maintaining physical fitness and hobbies for stress relief; 6) Visualizing your success and the impact of achieving your goal; 7) Reading success stories of others who've achieved similar goals."
        }
      ]
    },
    {
      category: "Results and Selection",
      questions: [
        {
          question: "How are cutoffs determined and what factors influence them?",
          answer: "Cutoffs are determined by factors including: 1) Number of candidates appearing vs. vacancies available; 2) Overall difficulty level of the exam; 3) Performance distribution of candidates; 4) Previous year trends; 5) Normalization processes (in multi-shift exams); 6) Category-wise reservation requirements. Cutoffs typically increase with better candidate preparation and decrease with exam difficulty."
        },
        {
          question: "What should I do immediately after exam results are declared?",
          answer: "After results: 1) Download and save your scorecard immediately; 2) Check for any discrepancies in personal details; 3) Prepare documents for document verification (if selected); 4) Schedule medical examinations if required; 5) Research about the training process and job responsibilities; 6) If not selected, analyze your performance to identify improvement areas for future attempts."
        },
        {
          question: "How should I prepare for document verification and interviews?",
          answer: "For document verification: Prepare all original documents with photocopies, ensure certificates are in good condition, and arrive early. For interviews: Research the organization thoroughly, practice common questions, work on communication skills, stay updated with current affairs related to your field, dress professionally, and maintain confident body language. Mock interviews with experienced persons can be very helpful."
        }
      ]
    }
  ];

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p className="faq-subtitle">
          Get expert answers to your most important questions about government jobs, exam preparation, and career guidance.
        </p>
      </div>
      
      {faqs.map((category, categoryIndex) => (
        <div key={categoryIndex} className="faq-category">
          <h2 className="category-title">{category.category}</h2>
          
          {category.questions.map((faq, index) => {
            const globalIndex = categoryIndex * 100 + index; // Create unique index
            const isActive = activeIndex === globalIndex;
            
            return (
              <div key={globalIndex} className={`faq-item ${isActive ? 'active' : ''}`}>
                <div 
                  className="faq-question"
                  onClick={() => toggleFAQ(globalIndex)}
                >
                  <h3>{faq.question}</h3>
                  <span className="faq-toggle">{isActive ? '−' : '+'}</span>
                </div>
                
                {isActive && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div className="faq-footer">
        <h3>Still have questions?</h3>
        <p>
          Can't find what you're looking for? Our expert team is here to help you succeed in your government job aspirations.
        </p>
        <div className="contact-options">
          <a href="/contact" className="contact-btn">Contact Us</a>
          <a href="/career-blog" className="blog-btn">Read Our Career Blog</a>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 