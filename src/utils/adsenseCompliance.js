/**
 * Google AdSense Compliance Manager
 * Ensures all pages meet AdSense Program Policies
 * - Prevents ads on pages without sufficient content
 * - Validates content quality before showing ads
 * - Manages ad placement according to best practices
 * 
 * Based on Google AdSense Program Policies and Quality Guidelines
 */

// Minimum content requirements for ad display
const CONTENT_REQUIREMENTS = {
  MIN_WORD_COUNT: 300,           // Minimum 300 words of meaningful content
  MIN_PARAGRAPHS: 3,             // At least 3 substantial paragraphs
  MIN_CONTENT_HEIGHT: 500,       // Minimum content height in pixels
  MIN_PAGE_LOAD_TIME: 2000,      // Minimum time on page before showing ads (ms)
  MIN_UNIQUE_SENTENCES: 5,       // Minimum unique sentences
  MIN_LINKS: 2,                  // Minimum internal/external links
};

// Pages that should NEVER show ads
const AD_BLACKLIST = [
  '/admin',
  '/admin-login',
  '/admin-dashboard',
  '/404',
  '/error',
  '/offline',
];

// Content quality indicators
const QUALITY_INDICATORS = {
  hasHeadings: false,
  hasStructuredData: false,
  hasImages: false,
  hasLists: false,
  hasLinks: false,
  hasMetadata: false,
  isComplete: false,
  isUnderConstruction: false,
};

/**
 * Check if current page is eligible for ads
 */
export function isPageEligibleForAds(pathname = window.location.pathname) {
  // Check blacklist
  if (AD_BLACKLIST.some(path => pathname.startsWith(path))) {
    console.log('AdSense: Page blacklisted for ads');
    return false;
  }

  // Check if page is under construction
  const bodyText = document.body.textContent.toLowerCase();
  const constructionKeywords = ['under construction', 'coming soon', 'work in progress', 'page not found'];
  if (constructionKeywords.some(keyword => bodyText.includes(keyword))) {
    console.log('AdSense: Page under construction');
    return false;
  }

  return true;
}

/**
 * Analyze page content quality
 */
export function analyzeContentQuality() {
  const content = document.querySelector('.page-container, main, article, .job-details-container, .result-details-container');
  
  if (!content) {
    console.log('AdSense: No main content container found');
    return {
      eligible: false,
      reason: 'No main content found',
      score: 0,
      details: {}
    };
  }

  const text = content.textContent || '';
  const html = content.innerHTML || '';
  
  // Word count analysis
  const words = text.trim().split(/\s+/).filter(word => word.length > 2);
  const wordCount = words.length;
  
  // Sentence analysis
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const uniqueSentences = new Set(sentences).size;
  
  // Paragraph analysis
  const paragraphs = content.querySelectorAll('p, .content-section, .job-section, .info-table tr');
  const paragraphCount = paragraphs.length;
  
  // Calculate substantial paragraph count (paragraphs with meaningful content)
  const substantialParagraphs = Array.from(paragraphs).filter(p => {
    const pText = p.textContent.trim();
    const pWords = pText.split(/\s+/).length;
    return pWords > 15; // At least 15 words per paragraph
  }).length;
  
  // Heading analysis
  const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const hasHeadings = headings.length >= 2;
  
  // Links analysis
  const links = content.querySelectorAll('a[href]');
  const internalLinks = Array.from(links).filter(a => {
    const href = a.getAttribute('href');
    return href && !href.startsWith('http') && !href.startsWith('//');
  });
  const hasLinks = links.length >= CONTENT_REQUIREMENTS.MIN_LINKS;
  
  // Image analysis
  const images = content.querySelectorAll('img');
  const hasImages = images.length > 0;
  
  // List analysis
  const lists = content.querySelectorAll('ul, ol, dl, .info-table');
  const hasLists = lists.length > 0;
  
  // Metadata analysis
  const hasTitle = document.querySelector('title')?.textContent.length > 20;
  const hasDescription = document.querySelector('meta[name="description"]')?.content.length > 50;
  const hasMetadata = hasTitle && hasDescription;
  
  // Structured data analysis
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  const hasStructuredData = structuredData.length > 0;
  
  // Content height
  const contentHeight = content.offsetHeight;
  
  // Calculate quality score (0-100)
  let score = 0;
  let reasons = [];
  
  // Word count check (30 points)
  if (wordCount >= CONTENT_REQUIREMENTS.MIN_WORD_COUNT) {
    score += 30;
  } else {
    reasons.push(`Insufficient word count: ${wordCount}/${CONTENT_REQUIREMENTS.MIN_WORD_COUNT}`);
  }
  
  // Paragraph check (20 points)
  if (substantialParagraphs >= CONTENT_REQUIREMENTS.MIN_PARAGRAPHS) {
    score += 20;
  } else {
    reasons.push(`Insufficient paragraphs: ${substantialParagraphs}/${CONTENT_REQUIREMENTS.MIN_PARAGRAPHS}`);
  }
  
  // Content height check (15 points)
  if (contentHeight >= CONTENT_REQUIREMENTS.MIN_CONTENT_HEIGHT) {
    score += 15;
  } else {
    reasons.push(`Insufficient content height: ${contentHeight}px/${CONTENT_REQUIREMENTS.MIN_CONTENT_HEIGHT}px`);
  }
  
  // Structure check (10 points each)
  if (hasHeadings) score += 10;
  else reasons.push('Missing proper headings');
  
  if (hasLinks) score += 10;
  else reasons.push('Insufficient links');
  
  if (hasLists) score += 5;
  if (hasImages) score += 5;
  if (hasMetadata) score += 5;
  
  // Unique content check (bonus)
  if (uniqueSentences >= CONTENT_REQUIREMENTS.MIN_UNIQUE_SENTENCES) {
    score += 5;
  } else {
    reasons.push(`Insufficient unique sentences: ${uniqueSentences}/${CONTENT_REQUIREMENTS.MIN_UNIQUE_SENTENCES}`);
  }
  
  const isEligible = score >= 70; // Need at least 70/100 to show ads
  
  return {
    eligible: isEligible,
    score: score,
    reason: isEligible ? 'Content meets quality standards' : 'Content quality insufficient',
    details: {
      wordCount,
      paragraphCount: substantialParagraphs,
      uniqueSentences,
      contentHeight,
      hasHeadings,
      hasLinks,
      hasLists,
      hasImages,
      hasMetadata,
      hasStructuredData,
      reasons: reasons.length > 0 ? reasons : ['All quality checks passed']
    }
  };
}

/**
 * Initialize AdSense with compliance checks
 */
export function initializeAdSense() {
  // Don't initialize if not eligible
  if (!isPageEligibleForAds()) {
    console.log('AdSense: Page not eligible for ads');
    removeAllAds();
    return false;
  }

  // Wait for minimum page load time
  setTimeout(() => {
    const contentQuality = analyzeContentQuality();
    
    console.log('AdSense Content Quality Analysis:', contentQuality);
    
    if (!contentQuality.eligible) {
      console.warn('AdSense: Content quality insufficient', contentQuality.details);
      removeAllAds();
      return false;
    }
    
    // Load AdSense script only if all checks pass
    loadAdSenseScript();
  }, CONTENT_REQUIREMENTS.MIN_PAGE_LOAD_TIME);
  
  return true;
}

/**
 * Load AdSense script dynamically
 */
function loadAdSenseScript() {
  // Check if script already exists
  if (document.querySelector('script[src*="adsbygoogle.js"]')) {
    console.log('AdSense: Script already loaded');
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  
  // Add your AdSense client ID here
  // script.dataset.adClient = 'ca-pub-XXXXXXXXXXXXXXXXX';
  
  script.onerror = () => {
    console.error('AdSense: Failed to load script');
  };
  
  script.onload = () => {
    console.log('AdSense: Script loaded successfully');
    initializeAdUnits();
  };
  
  document.head.appendChild(script);
}

/**
 * Initialize ad units on the page
 */
function initializeAdUnits() {
  const adElements = document.querySelectorAll('.adsbygoogle');
  
  if (adElements.length === 0) {
    console.log('AdSense: No ad units found on page');
    return;
  }
  
  adElements.forEach((adElement, index) => {
    try {
      // Only initialize if not already initialized
      if (!adElement.dataset.adsbygoogleStatus) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log(`AdSense: Initialized ad unit ${index + 1}`);
      }
    } catch (error) {
      console.error(`AdSense: Error initializing ad unit ${index + 1}`, error);
    }
  });
}

/**
 * Remove all ads from page
 */
function removeAllAds() {
  const adElements = document.querySelectorAll('.adsbygoogle, .ad-container, [class*="ad-"]');
  adElements.forEach(element => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
  console.log('AdSense: All ads removed from page');
}

/**
 * Create ad unit component
 * Returns null if page is not eligible
 */
export function createAdUnit(config = {}) {
  if (!isPageEligibleForAds()) {
    return null;
  }

  const {
    slot = '',
    format = 'auto',
    responsive = true,
    className = 'ad-container',
    style = {}
  } = config;

  const container = document.createElement('div');
  container.className = className;
  
  const ins = document.createElement('ins');
  ins.className = 'adsbygoogle';
  ins.style.display = 'block';
  
  if (slot) {
    ins.dataset.adSlot = slot;
  }
  
  ins.dataset.adFormat = format;
  
  if (responsive) {
    ins.dataset.fullWidthResponsive = 'true';
  }
  
  Object.assign(ins.style, style);
  
  container.appendChild(ins);
  
  return container;
}

/**
 * Validate page compliance without React hook
 * Use this in non-React contexts or call from components directly
 */
export function checkPageCompliance() {
  return new Promise((resolve) => {
    const eligible = isPageEligibleForAds();
    
    if (!eligible) {
      resolve({ canShowAds: false, contentQuality: null });
      return;
    }

    // Wait for content to load
    setTimeout(() => {
      const quality = analyzeContentQuality();
      const canShowAds = quality.eligible;
      
      if (canShowAds) {
        loadAdSenseScript();
      }
      
      resolve({ canShowAds, contentQuality: quality });
    }, CONTENT_REQUIREMENTS.MIN_PAGE_LOAD_TIME);
  });
}

/**
 * Get ad placement recommendations based on content
 */
export function getAdPlacementRecommendations() {
  const content = document.querySelector('.page-container, main, article');
  if (!content) return [];

  const recommendations = [];
  const contentHeight = content.offsetHeight;
  const paragraphs = content.querySelectorAll('p');
  
  // Top ad (after header/navigation)
  recommendations.push({
    position: 'top',
    placement: 'after-navigation',
    type: 'horizontal',
    format: 'auto'
  });

  // In-content ads (between paragraphs)
  if (paragraphs.length >= 8) {
    const midPoint = Math.floor(paragraphs.length / 2);
    recommendations.push({
      position: 'middle',
      placement: `after-paragraph-${midPoint}`,
      type: 'in-article',
      format: 'fluid'
    });
  }

  // Sidebar ad (if layout supports it)
  if (window.innerWidth > 1024) {
    recommendations.push({
      position: 'sidebar',
      placement: 'right-rail',
      type: 'vertical',
      format: 'auto'
    });
  }

  // Bottom ad (before footer)
  if (contentHeight > 1000) {
    recommendations.push({
      position: 'bottom',
      placement: 'before-footer',
      type: 'horizontal',
      format: 'auto'
    });
  }

  return recommendations;
}

export default {
  isPageEligibleForAds,
  analyzeContentQuality,
  initializeAdSense,
  createAdUnit,
  checkPageCompliance,
  getAdPlacementRecommendations,
};
