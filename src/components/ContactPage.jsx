import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './LegalPages.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page-container">
      <Helmet>
        <title>Contact Us - The Sarkari Result</title>
        <meta name="description" content="Contact The Sarkari Result for any queries regarding government jobs, results, admit cards, and notifications." />
      </Helmet>

      <div className="contact-page">
        <h1 className="page-title">Contact Us</h1>
        
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              We're here to help you with any questions or concerns you may have about 
              government jobs, results, admit cards, and other sarkari notifications.
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <h3>📧 Email</h3>
                <p>financecompanion91@gmail.com</p>
              </div>
              
              <div className="contact-item">
                <h3>🌐 Website</h3>
                <p>thesarkariresult.info</p>
              </div>
              
              <div className="contact-item">
                <h3>⏰ Response Time</h3>
                <p>We typically respond within 24-48 hours</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enter the subject"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Enter your message here..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="contact-footer">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-items">
            <div className="faq-item">
              <h4>How often is the website updated?</h4>
              <p>Our website is updated daily with the latest government job notifications, results, and admit cards.</p>
            </div>
            
            <div className="faq-item">
              <h4>Can you help with application processes?</h4>
              <p>We provide information about job notifications and application processes, but you need to apply directly on the official websites.</p>
            </div>
            
            <div className="faq-item">
              <h4>Do you charge for any services?</h4>
              <p>No, all information on our website is completely free. We do not charge for any services.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
