import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);
    // Store email in Supabase
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);
    if (error) {
      setError('This email is already subscribed or invalid.');
    } else {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="social-buttons">
          <a href="https://chat.whatsapp.com/GNQMuV4AT8p7mcXwDdoigP" target="_blank" rel="noopener noreferrer" className="social-btn whatsapp">📱 WhatsApp</a>
          <a href="#" className="social-btn telegram">📱 Telegram</a>
        </div>
        
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/disclaimer">Disclaimer</a>
        </div>
        
        <div className="copyright">
          <p>Copyright © 2009 - 2025 | <strong>thesarkariresult.info</strong></p>
          <p style={{marginTop: '10px', fontSize: '12px', color: '#95a5a6'}}>
            This website is not associated with official websites. All information provided is for general informational purposes only.
          </p>
        </div>

        <div style={{ margin: '24px 0' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <label htmlFor="newsletter-email" style={{ fontWeight: 'bold', marginBottom: 4 }}>Subscribe to our Newsletter</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{ padding: 8, borderRadius: 3, border: '1px solid #ddd', width: 250 }}
            />
            <button type="submit" style={{ padding: '8px 16px', borderRadius: 3, background: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Subscribe
            </button>
            {submitted && <div style={{ color: 'green', marginTop: 8 }}>Thank you for subscribing!</div>}
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 