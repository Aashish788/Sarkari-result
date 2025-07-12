import React from 'react';
import { Helmet } from 'react-helmet-async';
import './LegalPages.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="page-container">
      <Helmet>
        <title>Privacy Policy - The Sarkari Result</title>
        <meta name="description" content="Privacy Policy for The Sarkari Result - Learn about our commitment to not collecting personal information." />
      </Helmet>

      <div className="legal-page">
        <h1 className="page-title">Privacy Policy</h1>
        
        <div className="legal-content">
          <p className="last-updated">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
          
          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              At The Sarkari Result (thesarkariresult.info), we are committed to protecting your privacy. 
              We want to be transparent about our practices: <strong>we do not collect, store, or process any personal information from our users.</strong> 
              This Privacy Policy explains our approach to user privacy when you visit our website.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information Collection</h2>
            <p>
              <strong>We do not collect any information.</strong>
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Information Sharing and Disclosure</h2>
            <p>
              Since we do not collect personal information, there is no personal data to share or disclose. 
              We do not sell, trade, rent, or share any user information with third parties.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Cookies and Tracking Technologies</h2>
            <p>
              We do not use cookies to track users or collect personal information. Any technical cookies 
              that may be automatically set by the browser are minimal and used only for basic website functionality. 
              You can disable cookies in your browser settings without affecting your ability to use our website.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Data Security</h2>
            <p>
              Since we do not collect personal information, there is no personal data to secure. 
              However, we implement appropriate security measures to protect our website infrastructure 
              and ensure safe browsing for all users.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Third-Party Links</h2>
            <p>
              Our website contains links to official government websites and other third-party sites. 
              We are not responsible for the privacy practices or content of these external sites. 
              We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Children's Privacy</h2>
            <p>
              Our website does not collect any personal information from anyone, including children under 13 years of age. 
              Since we do not collect personal data, there are no special considerations needed for children's privacy.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Your Rights</h2>
            <p>Since we do not collect personal information, there is no personal data to:</p>
            <ul>
              <li>Access or update</li>
              <li>Request deletion of</li>
              <li>Restrict processing of</li>
              <li>Port to another service</li>
            </ul>
            <p>You can browse our website freely without any privacy concerns about personal data collection.</p>
          </section>

          <section className="legal-section">
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page with an updated "Last updated" date.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              Email: financecompanion91@gmail.com<br />
              Website: thesarkariresult.info
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
