import React, { useEffect } from 'react';

const AdsterraBanner = ({ style }) => {
  useEffect(() => {
    // Create the configuration script
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.innerHTML = `
      atOptions = {
        'key' : '258349935b89cd928b4bd410da0970fa',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;

    // Create the ad script
    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = '//www.highperformanceformat.com/258349935b89cd928b4bd410da0970fa/invoke.js';
    adScript.async = true;

    // Append scripts to the component container
    const container = document.getElementById('adsterra-banner-container');
    if (container) {
      container.appendChild(configScript);
      container.appendChild(adScript);
    }

    // Cleanup function
    return () => {
      if (container) {
        // Remove scripts when component unmounts
        const scripts = container.getElementsByTagName('script');
        while (scripts.length > 0) {
          container.removeChild(scripts[0]);
        }
      }
    };
  }, []);

  return (
    <div 
      id="adsterra-banner-container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
        padding: '10px',
        minHeight: '80px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        ...style
      }}
    >
      {/* Ad will be injected here by the script */}
    </div>
  );
};

export default AdsterraBanner;
