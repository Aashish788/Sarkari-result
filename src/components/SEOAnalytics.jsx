import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SEOAnalytics = () => {
  const location = useLocation();
  const [performance, setPerformance] = useState({});

  useEffect(() => {
    // Track page views for SEO analytics
    const trackPageView = () => {
      // Google Analytics 4 tracking
      if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
          page_title: document.title,
          page_location: window.location.href,
          custom_map: {
            custom_parameter_1: 'page_type',
            custom_parameter_2: 'content_category'
          }
        });

        gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: location.pathname
        });
      }

      // Track Core Web Vitals
      if ('web-vital' in window) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(console.log);
          getFID(console.log);
          getFCP(console.log);
          getLCP(console.log);
          getTTFB(console.log);
        });
      }
    };

    // Performance monitoring
    const monitorPerformance = () => {
      if ('performance' in window && typeof performance.getEntriesByType === 'function') {
        try {
          const navigation = performance.getEntriesByType('navigation')[0];
          const paint = performance.getEntriesByType('paint');
          
          setPerformance({
            loadTime: navigation?.loadEventEnd - navigation?.loadEventStart,
            domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
            transferSize: navigation?.transferSize,
            encodedBodySize: navigation?.encodedBodySize
          });
        } catch (error) {
          console.error('Performance monitoring error:', error);
        }
      }
    };

    // Schema.org validation
    const validateStructuredData = () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => {
        try {
          JSON.parse(script.textContent);
        } catch (error) {
          console.error('Invalid JSON-LD structured data:', error);
        }
      });
    };

    // SEO Meta Tags validation
    const validateSEOTags = () => {
      const requiredTags = [
        'title',
        'meta[name="description"]',
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[property="og:image"]',
        'meta[name="twitter:card"]',
        'link[rel="canonical"]'
      ];

      requiredTags.forEach(selector => {
        const element = document.querySelector(selector);
        if (!element) {
          console.warn(`Missing SEO tag: ${selector}`);
        }
      });
    };

    // Image optimization check
    const checkImageOptimization = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.alt) {
          console.warn('Image missing alt text:', img.src);
        }
        if (!img.loading) {
          console.warn('Image missing lazy loading:', img.src);
        }
      });
    };

    trackPageView();
    monitorPerformance();
    validateStructuredData();
    validateSEOTags();
    checkImageOptimization();

  }, [location]);

  return null; // This component doesn't render anything visible
};

// Advanced SEO optimization hooks
export const useSEOOptimization = () => {
  const location = useLocation();

  const optimizeImages = () => {
    // Implement lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  };

  const optimizeLinks = () => {
    // Add rel="noopener" to external links
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href^="https://thesarkariresult.info"])');
    externalLinks.forEach(link => {
      if (!link.rel.includes('noopener')) {
        link.rel = link.rel ? `${link.rel} noopener` : 'noopener';
      }
      if (!link.rel.includes('noreferrer')) {
        link.rel = link.rel ? `${link.rel} noreferrer` : 'noreferrer';
      }
    });
  };

  const addMissingAltTags = () => {
    // Add alt tags to images that don't have them
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    imagesWithoutAlt.forEach(img => {
      const altText = img.title || img.src.split('/').pop().split('.')[0].replace(/-/g, ' ');
      img.alt = altText;
    });
  };

  const optimizeHeadings = () => {
    // Ensure proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > lastLevel + 1) {
        console.warn(`Heading hierarchy jump from h${lastLevel} to h${level}:`, heading.textContent);
      }
      lastLevel = level;
    });
  };

  useEffect(() => {
    // Run optimizations after component mounts
    setTimeout(() => {
      optimizeImages();
      optimizeLinks();
      addMissingAltTags();
      optimizeHeadings();
    }, 100);
  }, [location]);

  return {
    optimizeImages,
    optimizeLinks,
    addMissingAltTags,
    optimizeHeadings
  };
};

// SEO Content Analysis
export const useSEOContentAnalysis = (content) => {
  const [analysis, setAnalysis] = useState({});

  useEffect(() => {
    if (!content) return;

    const analyzeContent = () => {
      const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
      const words = text.split(/\s+/).filter(word => word.length > 0);
      const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
      
      // Readability analysis
      const avgWordsPerSentence = words.length / sentences.length;
      const readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (words.filter(word => word.length > 6).length / words.length));
      
      // Keyword density analysis
      const wordFrequency = {};
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
        if (cleanWord.length > 3) {
          wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
        }
      });

      const topKeywords = Object.entries(wordFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([word, count]) => ({ word, count, density: ((count / words.length) * 100).toFixed(2) }));

      setAnalysis({
        wordCount: words.length,
        sentenceCount: sentences.length,
        avgWordsPerSentence: avgWordsPerSentence.toFixed(1),
        readabilityScore: readabilityScore.toFixed(1),
        topKeywords,
        recommendations: generateRecommendations(words.length, readabilityScore, topKeywords)
      });
    };

    analyzeContent();
  }, [content]);

  const generateRecommendations = (wordCount, readabilityScore, keywords) => {
    const recommendations = [];

    if (wordCount < 300) {
      recommendations.push('Consider adding more content. Aim for at least 300 words for better SEO.');
    }

    if (readabilityScore < 60) {
      recommendations.push('Content may be too complex. Consider using shorter sentences and simpler words.');
    }

    if (keywords.length > 0 && keywords[0].density > 3) {
      recommendations.push(`Keyword "${keywords[0].word}" appears too frequently (${keywords[0].density}%). Aim for 1-2% keyword density.`);
    }

    return recommendations;
  };

  return analysis;
};

// Local SEO optimization
export const useLocalSEO = () => {
  const addLocalBusinessSchema = (businessData) => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": businessData.name || "Sarkari Result",
      "description": businessData.description || "Government jobs and exam information portal",
      "url": "https://thesarkariresult.info",
      "telephone": businessData.phone,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressLocality": businessData.city || "India"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": businessData.latitude || "20.5937",
        "longitude": businessData.longitude || "78.9629"
      },
      "openingHours": "Mo-Su 00:00-23:59",
      "sameAs": [
        "https://thesarkariresult.info"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  };

  return { addLocalBusinessSchema };
};

export default SEOAnalytics;
