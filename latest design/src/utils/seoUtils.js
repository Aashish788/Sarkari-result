// Advanced SEO utilities for better search engine optimization
export const seoConfig = {
  siteName: "Sarkari Result",
  siteUrl: "https://thesarkariresult.info",
  defaultTitle: "Sarkari Result 2025 - Latest Government Jobs, Results & Notifications",
  defaultDescription: "Get latest sarkari results, government job notifications, admit cards, answer keys, exam results, recruitment updates, and employment news. Your trusted source for all government exam information.",
  defaultKeywords: "sarkari result, government jobs, sarkari naukri, latest jobs, admit card, answer key, exam results, recruitment, vacancy, government exam, notification, online form, employment news, career, job alert",
  twitterHandle: "@sarkariresult",
  facebookPage: "https://facebook.com/sarkariresult",
  linkedinPage: "https://linkedin.com/company/sarkariresult",
  instagramPage: "https://instagram.com/sarkariresult"
};

// Generate optimized meta title
export const generateTitle = (pageTitle, category = null) => {
  if (!pageTitle) return seoConfig.defaultTitle;
  
  const titleParts = [pageTitle];
  
  if (category) {
    titleParts.push(category);
  }
  
  titleParts.push("Sarkari Result 2025");
  
  return titleParts.join(" | ");
};

// Generate optimized meta description
export const generateDescription = (content, category = null) => {
  if (!content) return seoConfig.defaultDescription;
  
  let description = content;
  
  // Add category context
  if (category) {
    description = `${category}: ${description}`;
  }
  
  // Add call-to-action and site branding
  description += " - Get latest updates on Sarkari Result 2025.";
  
  // Ensure optimal length (150-160 characters)
  if (description.length > 160) {
    description = description.substring(0, 157) + "...";
  }
  
  return description;
};

// Generate keywords for specific content types
export const generateKeywords = (baseKeywords = [], contentType = null, specific = []) => {
  const commonKeywords = seoConfig.defaultKeywords.split(", ");
  
  const contentTypeKeywords = {
    jobs: ["latest jobs 2025", "government vacancy", "sarkari bharti", "job notification", "recruitment 2025", "employment opportunity"],
    results: ["exam result", "sarkari result 2025", "government exam result", "merit list", "scorecard", "result notification"],
    admitcard: ["admit card download", "hall ticket", "exam admit card", "call letter", "examination admit card"],
    answerkey: ["answer key 2025", "official answer key", "exam answer key", "solution paper", "question paper solution"],
    admission: ["admission notification", "college admission", "university admission", "entrance exam", "admission form"],
    syllabus: ["exam syllabus", "study material", "exam pattern", "course curriculum", "preparation guide"]
  };
  
  let allKeywords = [...commonKeywords];
  
  if (contentType && contentTypeKeywords[contentType]) {
    allKeywords = [...allKeywords, ...contentTypeKeywords[contentType]];
  }
  
  allKeywords = [...allKeywords, ...baseKeywords, ...specific];
  
  // Remove duplicates and return unique keywords
  return [...new Set(allKeywords)];
};

// Generate structured data for job postings
export const generateJobStructuredData = (job) => {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.organization || "Government of India",
      "value": job.id || job.slug
    },
    "datePosted": job.publishedDate || job.createdAt,
    "validThrough": job.lastDate || job.applicationDeadline,
    "employmentType": job.employmentType || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.organization || "Government of India",
      "sameAs": job.organizationUrl || "https://india.gov.in"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location || "India",
        "addressRegion": job.state || "India",
        "addressCountry": "IN"
      }
    },
    "baseSalary": job.salary ? {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary,
        "unitText": "MONTH"
      }
    } : undefined,
    "qualifications": job.eligibility || job.qualifications,
    "responsibilities": job.jobDescription || job.description,
    "industry": "Government",
    "occupationalCategory": job.category || "Government Job",
    "workHours": job.workHours || "40 hours per week",
    "url": `${seoConfig.siteUrl}/jobs/${job.slug}`
  };
};

// Generate structured data for exam results
export const generateResultStructuredData = (result) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": result.title,
    "description": result.description,
    "startDate": result.resultDate || result.publishedDate,
    "eventStatus": "EventScheduled",
    "eventAttendanceMode": "OnlineEventAttendanceMode",
    "location": {
      "@type": "VirtualLocation",
      "url": `${seoConfig.siteUrl}/results/${result.slug}`
    },
    "organizer": {
      "@type": "Organization",
      "name": result.organization || "Government of India",
      "url": result.organizationUrl || "https://india.gov.in"
    },
    "offers": {
      "@type": "Offer",
      "url": `${seoConfig.siteUrl}/results/${result.slug}`,
      "price": "0",
      "priceCurrency": "INR",
      "availability": "InStock"
    }
  };
};

// Generate FAQ structured data
export const generateFAQStructuredData = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${seoConfig.siteUrl}${crumb.url}`
    }))
  };
};

// Generate sitemap data
export const generateSitemapUrls = (data) => {
  const urls = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/jobs', priority: 0.9, changefreq: 'daily' },
    { url: '/results', priority: 0.9, changefreq: 'daily' },
    { url: '/admit-card', priority: 0.8, changefreq: 'daily' },
    { url: '/answer-key', priority: 0.8, changefreq: 'daily' },
    { url: '/admission', priority: 0.8, changefreq: 'daily' },
    { url: '/syllabus', priority: 0.7, changefreq: 'weekly' },
    { url: '/documents', priority: 0.7, changefreq: 'weekly' },
    { url: '/contact', priority: 0.5, changefreq: 'monthly' },
    { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
    { url: '/disclaimer', priority: 0.3, changefreq: 'yearly' }
  ];

  // Add dynamic content URLs
  if (data.jobs) {
    data.jobs.forEach(job => {
      urls.push({
        url: `/jobs/${job.slug}`,
        priority: 0.8,
        changefreq: 'weekly',
        lastmod: job.updatedAt || job.createdAt
      });
    });
  }

  if (data.results) {
    data.results.forEach(result => {
      urls.push({
        url: `/results/${result.slug}`,
        priority: 0.8,
        changefreq: 'weekly',
        lastmod: result.updatedAt || result.createdAt
      });
    });
  }

  return urls;
};

// SEO optimization utilities
export const seoUtils = {
  // Clean and optimize text for SEO
  cleanText: (text) => {
    return text
      .replace(/[^\w\s-]/gi, '') // Remove special characters
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .toLowerCase();
  },

  // Generate slug from title
  generateSlug: (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  },

  // Extract excerpt from content
  generateExcerpt: (content, length = 160) => {
    const cleaned = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return cleaned.length > length 
      ? cleaned.substring(0, length).trim() + '...'
      : cleaned;
  },

  // Validate URL structure for SEO
  validateUrl: (url) => {
    const seoFriendlyPattern = /^[a-z0-9-\/]+$/;
    return seoFriendlyPattern.test(url);
  }
};

// Common FAQ data for different pages
export const commonFAQs = {
  general: [
    {
      question: "What is Sarkari Result?",
      answer: "Sarkari Result is a trusted platform providing latest government job notifications, exam results, admit cards, answer keys, and recruitment updates for all government exams in India."
    },
    {
      question: "How often is the website updated?",
      answer: "Our website is updated daily with the latest government job notifications, results, and exam-related information to ensure you don't miss any opportunities."
    },
    {
      question: "Is the information on Sarkari Result authentic?",
      answer: "Yes, all information on Sarkari Result is sourced from official government websites and notifications. We verify all details before publishing."
    }
  ],
  jobs: [
    {
      question: "How to apply for government jobs?",
      answer: "To apply for government jobs, visit the official website mentioned in the notification, fill the online application form, upload required documents, and pay the application fee if applicable."
    },
    {
      question: "What are the eligibility criteria for government jobs?",
      answer: "Eligibility criteria vary by position but typically include age limits, educational qualifications, and sometimes experience requirements. Check each job notification for specific details."
    }
  ],
  results: [
    {
      question: "How to check exam results?",
      answer: "Visit the official website of the conducting authority, enter your roll number/registration number and date of birth to view and download your result."
    },
    {
      question: "What to do if result is not displaying?",
      answer: "If your result is not displaying, check your roll number, clear browser cache, try different browser, or contact the exam conducting authority."
    }
  ]
};

export default {
  seoConfig,
  generateTitle,
  generateDescription,
  generateKeywords,
  generateJobStructuredData,
  generateResultStructuredData,
  generateFAQStructuredData,
  generateBreadcrumbStructuredData,
  generateSitemapUrls,
  seoUtils,
  commonFAQs
};
