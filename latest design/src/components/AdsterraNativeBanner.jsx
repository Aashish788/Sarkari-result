import React, { useEffect } from 'react';
import './AdsterraNativeBanner.css';

const AdsterraNativeBanner = ({ className = '', style = {} }) => {
  useEffect(() => {
    // Check if script is already loaded to avoid duplicates
    const existingScript = document.querySelector('script[src*="1972ed0e1033ca27ce9a64591bb2e00c"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = '//pl27486686.profitableratecpm.com/1972ed0e1033ca27ce9a64591bb2e00c/invoke.js';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      
      // Add error handling
      script.onerror = () => {
        console.warn('Adsterra Native Banner script failed to load');
      };
      
      document.head.appendChild(script);
      
      return () => {
        // Clean up script on unmount
        try {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        } catch (error) {
          console.warn('Error removing Adsterra script:', error);
        }
      };
    }
  }, []);

  return (
    <div className={`adsterra-native-banner ${className}`} style={style}>
      <div className="ad-label">Advertisement</div>
      <div 
        id="container-1972ed0e1033ca27ce9a64591bb2e00c"
        className="ad-container"
      />
    </div>
  );
};

export default AdsterraNativeBanner;
