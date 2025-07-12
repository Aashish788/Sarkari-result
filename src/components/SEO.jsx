import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  article = false,
  author,
  publishedTime,
  modifiedTime,
  tags = [],
  category,
  breadcrumbs = [],
  faqData = [],
  jobData = null,
  resultData = null,
  canonical = null
}) => {
  const location = useLocation();
  const currentUrl = `https://thesarkariresult.info${location.pathname}`;
  const defaultImage = 'https://thesarkariresult.info/icons/icon-512x512.png';
  
  // Base structured data
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sarkari Result",
    "url": "https://thesarkariresult.info",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://thesarkariresult.info/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // Organization structured data
  const organizationData = {
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
    "sameAs": [
      "https://thesarkariresult.info"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-XXXXXXXXXX",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  // Article structured data
  const articleData = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image || defaultImage,
    "author": {
      "@type": "Person",
      "name": author || "Sarkari Result Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sarkari Result",
      "logo": {
        "@type": "ImageObject",
        "url": "https://thesarkariresult.info/icons/icon-512x512.png"
      }
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "keywords": keywords,
    "articleSection": category,
    "articleBody": description
  } : null;

  // JobPosting structured data for jobs
  const jobPostingData = jobData ? {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": jobData.title,
    "description": jobData.description,
    "datePosted": jobData.datePosted,
    "validThrough": jobData.validThrough,
    "employmentType": jobData.employmentType || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": jobData.organization || "Government of India",
      "sameAs": jobData.organizationUrl
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressLocality": jobData.location || "India"
      }
    },
    "baseSalary": jobData.salary ? {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": jobData.salary,
        "unitText": "MONTH"
      }
    } : undefined,
    "qualifications": jobData.qualifications,
    "responsibilities": jobData.responsibilities,
    "url": currentUrl
  } : null;

  // FAQ structured data
  const faqStructuredData = faqData.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // Breadcrumb structured data
  const breadcrumbData = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  } : null;

  // Generate meta keywords
  const generateKeywords = () => {
    const baseKeywords = [
      "sarkari result", "government jobs", "sarkari naukri", "latest jobs",
      "admit card", "answer key", "exam results", "recruitment", "vacancy",
      "government exam", "sarkari job", "online form", "notification",
      "employment news", "career", "job alert", "exam pattern", "syllabus"
    ];
    
    const pageKeywords = keywords ? keywords.split(',').map(k => k.trim()) : [];
    const allKeywords = [...baseKeywords, ...pageKeywords, ...tags];
    
    return [...new Set(allKeywords)].join(', ');
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title} | Sarkari Result 2025</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={generateKeywords()} />
      <meta name="author" content={author || "Sarkari Result Team"} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || currentUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Sarkari Result" />
      <meta property="og:locale" content="en_IN" />
      
      {article && (
        <>
          <meta property="article:author" content={author || "Sarkari Result Team"} />
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:modified_time" content={modifiedTime || publishedTime} />
          <meta property="article:section" content={category} />
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@sarkariresult" />
      <meta name="twitter:creator" content="@sarkariresult" />
      
      {/* Additional Meta Tags for Better SEO */}
      <meta name="language" content="English" />
      <meta name="revisit-after" content="1 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Geo Meta Tags for India */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="geo.position" content="20.5937;78.9629" />
      <meta name="ICBM" content="20.5937, 78.9629" />
      
      {/* Publisher Info */}
      <link rel="publisher" href="https://thesarkariresult.info" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(baseStructuredData)}
      </script>
      
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
      
      {articleData && (
        <script type="application/ld+json">
          {JSON.stringify(articleData)}
        </script>
      )}
      
      {jobPostingData && (
        <script type="application/ld+json">
          {JSON.stringify(jobPostingData)}
        </script>
      )}
      
      {faqStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      )}
      
      {breadcrumbData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      )}
      
      {/* Preload critical resources */}
      <link rel="preload" href="/icons/icon-192x192.png" as="image" />
      <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" as="style" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
    </Helmet>
  );
};

export default SEO;
