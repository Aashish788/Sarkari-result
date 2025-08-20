// Google Analytics 4 Configuration for Advanced SEO Tracking
// Place this script in your HTML head or use Google Tag Manager

// Initialize Google Analytics 4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Main GA4 Configuration
gtag('config', 'GA_MEASUREMENT_ID', {
  // Page tracking
  page_title: document.title,
  page_location: window.location.href,
  
  // Custom dimensions for SEO
  custom_map: {
    'custom_parameter_1': 'page_type',
    'custom_parameter_2': 'content_category',
    'custom_parameter_3': 'search_term',
    'custom_parameter_4': 'traffic_source'
  },
  
  // Enhanced ecommerce (for job application tracking)
  send_page_view: false,
  
  // User engagement settings
  engagement_time_msec: 100,
  
  // Site speed monitoring
  site_speed_sample_rate: 100
});

// Advanced SEO Event Tracking
const SEOTracker = {
  // Track page views with enhanced data
  trackPageView: function(pageType = 'general', category = 'unknown') {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_type: pageType,
      content_category: category,
      timestamp: new Date().toISOString()
    });
  },

  // Track search queries
  trackSearch: function(searchTerm, resultCount = 0) {
    gtag('event', 'search', {
      search_term: searchTerm,
      result_count: resultCount,
      page_location: window.location.href
    });
  },

  // Track job/content interactions
  trackContentInteraction: function(action, contentType, contentId) {
    gtag('event', 'content_interaction', {
      action: action, // 'view', 'click', 'apply', 'download'
      content_type: contentType, // 'job', 'result', 'admit_card', 'answer_key'
      content_id: contentId,
      page_location: window.location.href
    });
  },

  // Track external link clicks
  trackExternalClick: function(url, linkText) {
    gtag('event', 'click', {
      event_category: 'external_link',
      event_label: url,
      link_text: linkText,
      transport_type: 'beacon'
    });
  },

  // Track file downloads
  trackDownload: function(fileName, fileType) {
    gtag('event', 'file_download', {
      file_name: fileName,
      file_type: fileType,
      page_location: window.location.href
    });
  },

  // Track form submissions
  trackFormSubmission: function(formType, formId) {
    gtag('event', 'form_submit', {
      form_type: formType,
      form_id: formId,
      page_location: window.location.href
    });
  },

  // Track scroll depth for content engagement
  trackScrollDepth: function(percentage) {
    gtag('event', 'scroll', {
      event_category: 'engagement',
      event_label: percentage + '%',
      value: percentage
    });
  },

  // Track site performance metrics
  trackPerformance: function() {
    if ('performance' in window) {
      window.addEventListener('load', function() {
        setTimeout(function() {
          const navigation = performance.getEntriesByType('navigation')[0];
          const paint = performance.getEntriesByType('paint');
          
          // Track Core Web Vitals
          gtag('event', 'performance_metrics', {
            page_load_time: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
            dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            first_paint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            first_contentful_paint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            page_location: window.location.href
          });
        }, 1000);
      });
    }
  },

  // Track user engagement time
  trackEngagementTime: function() {
    let startTime = Date.now();
    let isActive = true;
    
    // Track when user becomes inactive
    ['blur', 'beforeunload'].forEach(event => {
      window.addEventListener(event, function() {
        if (isActive) {
          const engagementTime = Date.now() - startTime;
          gtag('event', 'engagement_time', {
            engagement_time_msec: engagementTime,
            page_location: window.location.href
          });
          isActive = false;
        }
      });
    });
    
    // Reset timer when user becomes active again
    window.addEventListener('focus', function() {
      if (!isActive) {
        startTime = Date.now();
        isActive = true;
      }
    });
  },

  // Track conversion events
  trackConversion: function(conversionType, value = 0) {
    gtag('event', 'conversion', {
      event_category: 'conversion',
      event_label: conversionType, // 'job_application', 'newsletter_signup', 'whatsapp_join'
      value: value,
      currency: 'INR'
    });
  }
};

// Auto-initialize tracking
document.addEventListener('DOMContentLoaded', function() {
  // Determine page type from URL
  const path = window.location.pathname;
  let pageType = 'homepage';
  let category = 'general';
  
  if (path.includes('/jobs')) {
    pageType = 'jobs';
    category = 'employment';
  } else if (path.includes('/results')) {
    pageType = 'results';
    category = 'exam_results';
  } else if (path.includes('/admit-card')) {
    pageType = 'admit_card';
    category = 'admission';
  } else if (path.includes('/answer-key')) {
    pageType = 'answer_key';
    category = 'exam_answers';
  } else if (path.includes('/admission')) {
    pageType = 'admissions';
    category = 'education';
  } else if (path.includes('/search')) {
    pageType = 'search';
    category = 'search_results';
  }
  
  // Track initial page view
  SEOTracker.trackPageView(pageType, category);
  
  // Start engagement tracking
  SEOTracker.trackEngagementTime();
  
  // Track performance metrics
  SEOTracker.trackPerformance();
  
  // Auto-track external links
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href) {
      if (link.hostname !== window.location.hostname) {
        SEOTracker.trackExternalClick(link.href, link.textContent);
      }
    }
  });
  
  // Auto-track downloads
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href) {
      const fileName = link.href.split('/').pop();
      const fileExtension = fileName.split('.').pop().toLowerCase();
      const downloadTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar', 'txt'];
      
      if (downloadTypes.includes(fileExtension)) {
        SEOTracker.trackDownload(fileName, fileExtension);
      }
    }
  });
  
  // Track scroll depth
  let scrollDepthMarkers = [25, 50, 75, 100];
  let scrollDepthReached = [];
  
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    scrollDepthMarkers.forEach(marker => {
      if (scrollPercent >= marker && !scrollDepthReached.includes(marker)) {
        scrollDepthReached.push(marker);
        SEOTracker.trackScrollDepth(marker);
      }
    });
  });
  
  // Track form submissions
  document.addEventListener('submit', function(e) {
    const form = e.target;
    const formId = form.id || 'unknown';
    const formType = form.getAttribute('data-form-type') || 'unknown';
    
    SEOTracker.trackFormSubmission(formType, formId);
  });
});

// Export for manual tracking
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SEOTracker;
} else {
  window.SEOTracker = SEOTracker;
}

// Google Search Console Integration
// Add this to connect with Google Search Console
const gscConfig = {
  // Track search console impressions and clicks
  trackSearchConsoleData: function() {
    // This would typically be done server-side
    // but can be implemented with Search Console API
    console.log('Search Console tracking initialized');
  },
  
  // Track featured snippet appearances
  trackFeaturedSnippet: function(query, position) {
    gtag('event', 'featured_snippet', {
      search_query: query,
      position: position,
      page_location: window.location.href
    });
  }
};

// Schema.org Structured Data Validation
const validateStructuredData = function() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  let isValid = true;
  
  scripts.forEach((script, index) => {
    try {
      JSON.parse(script.textContent);
    } catch (error) {
      console.error(`Invalid JSON-LD structured data at script ${index + 1}:`, error);
      isValid = false;
    }
  });
  
  gtag('event', 'structured_data_validation', {
    is_valid: isValid,
    script_count: scripts.length,
    page_location: window.location.href
  });
  
  return isValid;
};

// Run validation on page load
window.addEventListener('load', validateStructuredData);

// Track Core Web Vitals with web-vitals library
if (typeof webVitals !== 'undefined') {
  webVitals.getCLS(function(metric) {
    gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: 'CLS',
      value: Math.round(metric.value * 1000),
      non_interaction: true
    });
  });
  
  webVitals.getFID(function(metric) {
    gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: 'FID',
      value: Math.round(metric.value),
      non_interaction: true
    });
  });
  
  webVitals.getFCP(function(metric) {
    gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: 'FCP',
      value: Math.round(metric.value),
      non_interaction: true
    });
  });
  
  webVitals.getLCP(function(metric) {
    gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: 'LCP',
      value: Math.round(metric.value),
      non_interaction: true
    });
  });
  
  webVitals.getTTFB(function(metric) {
    gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: 'TTFB',
      value: Math.round(metric.value),
      non_interaction: true
    });
  });
}
