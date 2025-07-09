import React from 'react';

const PWAFeatures = () => {
  const features = [
    {
      icon: '📱',
      title: 'Install on Your Device',
      description: 'Add Sarkari Result to your home screen and access it like a native app',
      benefits: ['No app store needed', 'Instant access', 'Native app feel']
    },
    {
      icon: '🔔',
      title: 'Push Notifications',
      description: 'Get instant alerts for new job notifications, results, and admit cards',
      benefits: ['Never miss opportunities', 'Real-time updates', 'Customizable alerts']
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized performance with smart caching for instant page loads',
      benefits: ['Faster than websites', 'Smooth navigation', 'Reduced data usage']
    },
    {
      icon: '📡',
      title: 'Works Offline',
      description: 'Browse cached content even when you don\'t have internet connection',
      benefits: ['Access saved content', 'No connectivity worries', 'Always available']
    },
    {
      icon: '🔄',
      title: 'Auto Updates',
      description: 'Always stay up-to-date with the latest features and content',
      benefits: ['No manual updates', 'Latest features', 'Bug fixes automatically']
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Built with modern web security standards and privacy protection',
      benefits: ['HTTPS encryption', 'Privacy-focused', 'No tracking']
    }
  ];

  return (
    <div className="pwa-features-section">
      <div className="container">
        <div className="features-header">
          <h2>Why Install Sarkari Result App?</h2>
          <p>Experience the future of government job search with our Progressive Web App</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <ul className="benefits-list">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="install-cta">
          <h3>Ready to get started?</h3>
          <p>Install our app for the best Sarkari Result experience</p>
          <div className="install-instructions">
            <div className="instruction-item">
              <strong>Chrome/Edge:</strong> Look for the install icon in the address bar
            </div>
            <div className="instruction-item">
              <strong>Safari:</strong> Tap Share → Add to Home Screen
            </div>
            <div className="instruction-item">
              <strong>Firefox:</strong> Tap Menu → Install
            </div>
          </div>
        </div>

        <div className="pwa-badges">
          <div className="badge">
            <i className="fas fa-check-circle"></i>
            <span>PWA Ready</span>
          </div>
          <div className="badge">
            <i className="fas fa-bolt"></i>
            <span>Lightning Fast</span>
          </div>
          <div className="badge">
            <i className="fas fa-shield-alt"></i>
            <span>Secure</span>
          </div>
          <div className="badge">
            <i className="fas fa-mobile-alt"></i>
            <span>Mobile Optimized</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pwa-features-section {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 80px 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .features-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .features-header h2 {
          font-size: 36px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .features-header p {
          font-size: 18px;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          margin-bottom: 60px;
        }

        .feature-card {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .feature-card p {
          color: #64748b;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .benefits-list li {
          padding: 6px 0;
          color: #475569;
          position: relative;
          padding-left: 20px;
        }

        .benefits-list li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        .install-cta {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          margin-bottom: 40px;
        }

        .install-cta h3 {
          font-size: 28px;
          margin-bottom: 12px;
        }

        .install-cta p {
          margin-bottom: 30px;
          opacity: 0.9;
        }

        .install-instructions {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .instruction-item {
          background: rgba(255, 255, 255, 0.1);
          padding: 15px 20px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          flex: 1;
          min-width: 200px;
        }

        .instruction-item strong {
          display: block;
          margin-bottom: 5px;
        }

        .pwa-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          padding: 12px 20px;
          border-radius: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          color: #1e293b;
          font-weight: 600;
          border: 1px solid #e2e8f0;
        }

        .badge i {
          color: #10b981;
        }

        @media (max-width: 768px) {
          .pwa-features-section {
            padding: 60px 0;
          }

          .features-header h2 {
            font-size: 28px;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .feature-card {
            padding: 25px;
          }

          .install-cta {
            padding: 30px 20px;
          }

          .install-cta h3 {
            font-size: 24px;
          }

          .install-instructions {
            flex-direction: column;
          }

          .instruction-item {
            text-align: left;
          }

          .pwa-badges {
            justify-content: center;
          }

          .badge {
            flex: 1;
            justify-content: center;
            min-width: auto;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 15px;
          }

          .feature-card {
            padding: 20px;
          }

          .features-header h2 {
            font-size: 24px;
          }

          .install-cta {
            padding: 25px 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default PWAFeatures; 