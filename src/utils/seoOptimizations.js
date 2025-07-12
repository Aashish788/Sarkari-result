import React from 'react';
import { createRoot } from 'react-dom/client';
import { seoUtils } from '../utils/seoUtils.js';

// Generate XML Sitemap
export const generateSitemap = async (data) => {
  const urls = seoUtils.generateSitemapUrls(data);
  
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => `  <url>
    <loc>https://thesarkariresult.info${url.url}</loc>
    <lastmod>${url.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <mobile:mobile/>
  </url>`).join('\n')}
</urlset>`;

  return sitemapXML;
};

// Generate Robots.txt
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$
Disallow: /*?*

# Allow important files
Allow: /sitemap.xml
Allow: /robots.txt
Allow: /manifest.json
Allow: /sw.js

# Sitemap location
Sitemap: https://thesarkariresult.info/sitemap.xml

# Crawl delay for better server performance
Crawl-delay: 1`;
};

// Generate structured data for homepage
export const generateHomepageStructuredData = () => {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Sarkari Result",
      "alternateName": "The Sarkari Result",
      "url": "https://thesarkariresult.info",
      "description": "Latest government job notifications, results, admit cards, answer keys, and recruitment updates for all government exams in India",
      "inLanguage": "en-IN",
      "isAccessibleForFree": true,
      "logo": {
        "@type": "ImageObject",
        "url": "https://thesarkariresult.info/icons/icon-512x512.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://thesarkariresult.info"
      ],
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://thesarkariresult.info/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "mainEntity": {
        "@type": "ItemList",
        "name": "Government Job Categories",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Latest Jobs",
            "url": "https://thesarkariresult.info/jobs"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Results",
            "url": "https://thesarkariresult.info/results"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Admit Cards",
            "url": "https://thesarkariresult.info/admit-card"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Answer Keys",
            "url": "https://thesarkariresult.info/answer-key"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Admissions",
            "url": "https://thesarkariresult.info/admission"
          }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Sarkari Result",
      "url": "https://thesarkariresult.info",
      "logo": {
        "@type": "ImageObject",
        "url": "https://thesarkariresult.info/icons/icon-512x512.png",
        "width": 512,
        "height": 512
      },
      "description": "Leading platform for government job notifications and exam updates in India",
      "foundingDate": "2024",
      "founder": {
        "@type": "Person",
        "name": "Sarkari Result Team"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressLocality": "India"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-XXXXXXXXXX",
        "contactType": "Customer Service",
        "availableLanguage": ["English", "Hindi"],
        "areaServed": "IN"
      },
      "sameAs": [
        "https://thesarkariresult.info"
      ],
      "knowsAbout": [
        "Government Jobs",
        "Sarkari Naukri",
        "Exam Results",
        "Admit Cards",
        "Answer Keys",
        "Recruitment",
        "Employment"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://thesarkariresult.info"
        }
      ]
    }
  ];
};

// Performance optimization utilities
export const performanceOptimizations = {
  // Lazy load images with SEO-friendly attributes
  lazyLoadImage: (src, alt, className = '') => {
    return {
      src,
      alt,
      className,
      loading: 'lazy',
      decoding: 'async',
      'data-src': src,
      style: { aspectRatio: 'auto' }
    };
  },

  // Generate responsive image srcSet
  generateSrcSet: (baseUrl, sizes = [300, 600, 900, 1200]) => {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
  },

  // Preload critical resources
  preloadCriticalResources: () => {
    const resources = [
      { href: '/icons/icon-192x192.png', as: 'image' },
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' },
      { href: '/manifest.json', as: 'manifest' }
    ];

    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      document.head.appendChild(link);
    });
  }
};

// Meta tags optimization for social sharing
export const socialOptimization = {
  generateTwitterCard: (title, description, image, type = 'summary_large_image') => {
    return {
      'twitter:card': type,
      'twitter:site': '@sarkariresult',
      'twitter:creator': '@sarkariresult',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
      'twitter:image:alt': title
    };
  },

  generateOpenGraph: (title, description, image, url, type = 'website') => {
    return {
      'og:type': type,
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:url': url,
      'og:site_name': 'Sarkari Result',
      'og:locale': 'en_IN'
    };
  }
};

// Content optimization utilities
export const contentOptimization = {
  // Optimize content for featured snippets
  optimizeForFeaturedSnippets: (content) => {
    // Add structured headings
    // Add numbered/bulleted lists
    // Add concise answers to common questions
    return content;
  },

  // Generate table of contents for long content
  generateTableOfContents: (content) => {
    const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
    return headings.map((heading, index) => {
      const level = heading.match(/h([1-6])/)[1];
      const text = heading.replace(/<[^>]*>/g, '');
      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
      return {
        level: parseInt(level),
        text,
        id,
        href: `#${id}`
      };
    });
  },

  // Add schema markup to content
  addSchemaMarkup: (contentType, data) => {
    const schemas = {
      howto: {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": data.title,
        "description": data.description,
        "image": data.image,
        "step": data.steps?.map((step, index) => ({
          "@type": "HowToStep",
          "position": index + 1,
          "name": step.title,
          "text": step.description
        }))
      },
      qa: {
        "@context": "https://schema.org",
        "@type": "QAPage",
        "mainEntity": {
          "@type": "Question",
          "name": data.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": data.answer
          }
        }
      }
    };

    return schemas[contentType] || null;
  }
};

export default {
  generateSitemap,
  generateRobotsTxt,
  generateHomepageStructuredData,
  performanceOptimizations,
  socialOptimization,
  contentOptimization
};
