import React from 'react';

const OpenInAppButton = ({ slug, type }) => {
  const handleOpenInApp = () => {
    // Construct the deep link URL based on type
    let path = '';
    if (type === 'job') path = `/jobs/${slug}`;
    else if (type === 'result') path = `/results/${slug}`;
    else if (type === 'admit-card') path = `/admit-cards/${slug}`;
    else if (type === 'admission') path = `/admissions/${slug}`;
    else if (type === 'answer-key') path = `/answer-keys/${slug}`;
    else if (type === 'document') path = `/documents/${slug}`;
    
    const url = `https://thesarkariresult.info${path}`;
    
    // Try to open the link. If app is installed, it should intercept.
    window.location.href = url;
    
    // Fallback to Play Store if the app doesn't open
    setTimeout(() => {
      // Check again if we're still on the web page
      if (!document.hidden) {
        // Use intent URL for Android - this is much more reliable for triggering Play Store
        const playStoreUrl = 'market://details?id=com.Sarkaribuddy.app';
        const fallbackUrl = 'https://play.google.com/store/apps/details?id=com.Sarkaribuddy.app';
        
        // Try market protocol first (opens Play Store app directly)
        window.location.href = playStoreUrl;
        
        // Final fallback to web play store if market protocol fails
        setTimeout(() => {
          if (!document.hidden) {
            window.location.href = fallbackUrl;
          }
        }, 500);
      }
    }, 2500);
  };

  return (
    <div className="open-in-app-container" style={{ textAlign: 'center', margin: '20px 0' }}>
      <button onClick={handleOpenInApp} className="open-in-app-btn">
        <i className="fas fa-mobile-alt"></i> Open in App
      </button>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>
        For a better experience, try our official Android App
      </p>
    </div>
  );
};

export default OpenInAppButton;

