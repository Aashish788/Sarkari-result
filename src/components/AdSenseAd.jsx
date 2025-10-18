import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { isPageEligibleForAds, analyzeContentQuality } from '../utils/adsenseCompliance';

/**
 * Google AdSense Ad Component
 * Fully compliant with AdSense Program Policies
 * 
 * Features:
 * - Automatic content quality validation
 * - Policy-compliant ad placement
 * - Prevents ads on low-quality pages
 * - Responsive ad units
 * - Proper error handling
 */

const AdSenseAd = ({ 
  slot = '',
  format = 'auto',
  responsive = true,
  className = '',
  style = {},
  position = 'default',
  minContentQuality = 70
}) => {
  const [canShowAd, setCanShowAd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [qualityScore, setQualityScore] = useState(0);
  const adRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Reset state on route change
    setCanShowAd(false);
    setIsLoading(true);
    setQualityScore(0);

    // Check if page is eligible for ads
    if (!isPageEligibleForAds(location.pathname)) {
      console.log('AdSense: Page not eligible for ads');
      setIsLoading(false);
      return;
    }

    // Wait for content to fully load before validating
    const validationTimer = setTimeout(() => {
      const contentQuality = analyzeContentQuality();
      
      console.log('AdSense Quality Check:', {
        path: location.pathname,
        score: contentQuality.score,
        eligible: contentQuality.eligible,
        details: contentQuality.details
      });

      setQualityScore(contentQuality.score);

      if (contentQuality.eligible && contentQuality.score >= minContentQuality) {
        setCanShowAd(true);
        loadAdSense();
      } else {
        console.warn('AdSense: Content quality insufficient for ads', {
          required: minContentQuality,
          actual: contentQuality.score,
          reasons: contentQuality.details.reasons
        });
      }
      
      setIsLoading(false);
    }, 2000); // Wait 2 seconds for content to render

    return () => {
      clearTimeout(validationTimer);
    };
  }, [location.pathname, minContentQuality]);

  const loadAdSense = () => {
    try {
      // Check if AdSense script is loaded
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // Initialize ad
        if (adRef.current && !adRef.current.dataset.adsbygoogleStatus) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log('AdSense: Ad initialized successfully');
        }
      } else {
        // Load AdSense script if not already loaded
        loadAdSenseScript();
      }
    } catch (error) {
      console.error('AdSense: Error initializing ad', error);
    }
  };

  const loadAdSenseScript = () => {
    if (document.querySelector('script[src*="adsbygoogle.js"]')) {
      return; // Script already loaded
    }

    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    // TODO: Replace with your actual AdSense publisher ID
    // script.dataset.adClient = 'ca-pub-XXXXXXXXXXXXXXXXX';
    
    script.onload = () => {
      console.log('AdSense: Script loaded');
      if (adRef.current && !adRef.current.dataset.adsbygoogleStatus) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    };
    
    script.onerror = () => {
      console.error('AdSense: Failed to load script');
    };
    
    document.head.appendChild(script);
  };

  // Don't render anything if loading or not eligible
  if (isLoading) {
    return null;
  }

  if (!canShowAd) {
    // Optionally show a placeholder for debugging
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="ad-placeholder" style={{
          padding: '20px',
          margin: '20px 0',
          background: '#f0f0f0',
          border: '2px dashed #ccc',
          borderRadius: '4px',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          <p>Ad Blocked: Content Quality Score {qualityScore}/100</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            Minimum required: {minContentQuality}/100
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`ad-container ${className} ad-position-${position}`} style={{
      margin: '20px 0',
      padding: '10px',
      textAlign: 'center',
      minHeight: '100px',
      ...style
    }}>
      <div className="ad-label" style={{
        fontSize: '10px',
        color: '#999',
        marginBottom: '5px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Advertisement
      </div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX" // TODO: Replace with your actual publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

/**
 * Pre-configured ad components for common placements
 */

// Top of page ad (horizontal banner)
export const TopBannerAd = (props) => (
  <AdSenseAd
    format="horizontal"
    responsive={true}
    position="top"
    minContentQuality={75}
    {...props}
  />
);

// In-article ad (native/fluid)
export const InArticleAd = (props) => (
  <AdSenseAd
    format="fluid"
    responsive={true}
    position="in-article"
    minContentQuality={80}
    style={{ minHeight: '200px' }}
    {...props}
  />
);

// Sidebar ad (vertical)
export const SidebarAd = (props) => (
  <AdSenseAd
    format="vertical"
    responsive={true}
    position="sidebar"
    minContentQuality={70}
    style={{ minHeight: '250px' }}
    {...props}
  />
);

// Bottom ad (horizontal)
export const BottomAd = (props) => (
  <AdSenseAd
    format="horizontal"
    responsive={true}
    position="bottom"
    minContentQuality={75}
    {...props}
  />
);

// Multiplex ad (related content)
export const MultiplexAd = (props) => (
  <AdSenseAd
    format="autorelaxed"
    responsive={true}
    position="multiplex"
    minContentQuality={80}
    {...props}
  />
);

export default AdSenseAd;
