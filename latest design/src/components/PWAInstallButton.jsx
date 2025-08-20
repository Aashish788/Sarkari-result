import React, { useState, useEffect } from 'react';

const PWAInstallButton = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = window.navigator.standalone === true;
    
    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      return;
    }

    // Listen for the install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    const result = await installPrompt.prompt();
    console.log('Install prompt result:', result);

    setInstallPrompt(null);
    setIsInstallable(false);

    if (result.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  // Don't show button if app is already installed
  if (isInstalled) {
    return null;
  }

  // Don't show button if not installable
  if (!isInstallable) {
    return null;
  }

  return (
    <div className="pwa-install-banner">
      <div className="pwa-install-content">
        <div className="pwa-install-icon">
          <i className="fas fa-mobile-alt"></i>
        </div>
        <div className="pwa-install-text">
          <h4>Install Sarkari Result App</h4>
          <p>Get instant notifications for new jobs and results</p>
        </div>
        <div className="pwa-install-actions">
          <button 
            id="pwa-install-btn"
            onClick={handleInstallClick}
            className="pwa-install-button"
          >
            <i className="fas fa-download"></i>
            Install App
          </button>
          <button 
            onClick={() => setIsInstallable(false)}
            className="pwa-dismiss-button"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .pwa-install-banner {
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .pwa-install-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .pwa-install-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 12px;
          border-radius: 8px;
          font-size: 24px;
        }
        
        .pwa-install-text {
          flex: 1;
        }
        
        .pwa-install-text h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .pwa-install-text p {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }
        
        .pwa-install-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .pwa-install-button {
          background: rgba(255, 255, 255, 0.9);
          color: #1e40af;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .pwa-install-button:hover {
          background: white;
          transform: translateY(-1px);
        }
        
        .pwa-dismiss-button {
          background: transparent;
          color: white;
          border: none;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        
        .pwa-dismiss-button:hover {
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .pwa-install-banner {
            left: 10px;
            right: 10px;
            bottom: 10px;
          }
          
          .pwa-install-content {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
          
          .pwa-install-text {
            order: -1;
          }
          
          .pwa-install-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default PWAInstallButton; 