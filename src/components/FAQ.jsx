import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "What is Sarkari Result?",
      answer: "Sarkari Result : Find Latest Sarkari Job Vacancies And Sarkari Exam Results At thesarkariresult.info Get All The Information You Need On Govt Jobs And Online From, Exam, Results, Admit Card In One Place."
    },
    {
      question: "How can I check the latest government job vacancies?",
      answer: "You can visit the Sarkari Result website and navigate to the \"Latest Jobs\" section to check the latest government job vacancies."
    },
    {
      question: "Is Sarkari Result free to use?",
      answer: "Yes, Sarkari Result is completely free to use. You can access all the information on the website without any charges."
    }
  ];

  return (
    <div className="section faq-section">
      <h2 className="section-title">FAQ – Sarkari Result</h2>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <div className="faq-question">{faq.question}</div>
          <div className="faq-answer">{faq.answer}</div>
        </div>
      ))}
    </div>
  );
};

export default FAQ; 