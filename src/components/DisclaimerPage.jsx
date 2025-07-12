import React from 'react';
import { Helmet } from 'react-helmet-async';
import './LegalPages.css';

const DisclaimerPage = () => {
  return (
    <div className="page-container">
      <Helmet>
        <title>Disclaimer - The Sarkari Result</title>
        <meta name="description" content="Disclaimer for The Sarkari Result - Important information about the use of our website and services." />
      </Helmet>

      <div className="legal-page">
        <h1 className="page-title">Disclaimer</h1>
        
        <div className="legal-content">
          <p className="last-updated">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
          
          <section className="legal-section">
            <h2>1. General Information</h2>
            <p>
              The information contained on The Sarkari Result website (thesarkariresult.info) is for general information purposes only. 
              While we endeavor to keep the information up to date and correct, we make no representations 
              or warranties of any kind, express or implied, about the completeness, accuracy, reliability, 
              suitability, or availability of the website or the information contained on the website.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. No Official Affiliation</h2>
            <p>
              The Sarkari Result is an independent information portal and is not affiliated with any government 
              organization, recruitment board, or official authority. We are not responsible for any 
              recruitment process, selection procedure, or employment decisions made by any organization.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Information Accuracy</h2>
            <p>
              While we strive to provide accurate and up-to-date information about government jobs, results, 
              admit cards, and notifications, we cannot guarantee the accuracy or completeness of all information. 
              Users are advised to verify all information from official sources before taking any action.
            </p>
            <ul>
              <li>Always check official websites for authentic information</li>
              <li>Verify dates, eligibility criteria, and application procedures independently</li>
              <li>We are not responsible for any discrepancies in information</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. External Links</h2>
            <p>
              Our website may contain links to external websites that are not provided or maintained by us. 
              We do not guarantee the accuracy, relevance, timeliness, or completeness of any information 
              on these external websites. The inclusion of any link does not imply endorsement by us.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Limitation of Liability</h2>
            <p>
              In no event will The Sarkari Result, its owners, employees, or affiliates be liable for any loss 
              or damage including, without limitation, indirect or consequential loss or damage, or any 
              loss or damage whatsoever arising from:
            </p>
            <ul>
              <li>Use of or reliance on information provided on this website</li>
              <li>Inability to access the website or use its services</li>
              <li>Any errors or omissions in the content</li>
              <li>Any actions taken based on information from this website</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. User Responsibility</h2>
            <p>Users of this website are responsible for:</p>
            <ul>
              <li>Verifying all information from official sources</li>
              <li>Following proper application procedures as per official guidelines</li>
              <li>Meeting eligibility criteria for any position they apply for</li>
              <li>Ensuring they have the latest and accurate information before acting</li>
              <li>Understanding that we provide information only and not application services</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. No Guarantee of Results</h2>
            <p>
              We do not guarantee job placement, selection, or positive outcomes in any recruitment process. 
              Success in any examination or selection process depends entirely on individual merit, 
              preparation, and compliance with official requirements.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Website Availability</h2>
            <p>
              We strive to keep our website running smoothly, but we do not guarantee that the website 
              will be available at all times or that it will be free from errors, viruses, or other harmful components. 
              We reserve the right to suspend, modify, or discontinue any part of the website without notice.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Copyright and Intellectual Property</h2>
            <p>
              The content on this website, including but not limited to text, graphics, logos, and images, 
              is the property of The Sarkari Result or its content suppliers and is protected by copyright laws. 
              Unauthorized use of any content is prohibited.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Changes to Disclaimer</h2>
            <p>
              We reserve the right to modify this disclaimer at any time without prior notice. 
              Continued use of the website after any changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Governing Law</h2>
            <p>
              This disclaimer and any disputes arising out of or related to it shall be governed by 
              and construed in accordance with the laws of India, without regard to conflict of law principles.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about this disclaimer, please contact us at:
            </p>
            <p>
              Email: financecompanion91@gmail.com<br />
              Website: thesarkariresult.info
            </p>
          </section>

          <div className="important-notice">
            <h3>⚠️ Important Notice</h3>
            <p>
              <strong>Always verify information from official sources before taking any action. 
              We are an information portal only and not responsible for any recruitment decisions or outcomes.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;
