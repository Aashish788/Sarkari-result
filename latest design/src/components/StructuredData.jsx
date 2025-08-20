import React from 'react';
import { Helmet } from 'react-helmet-async';

const StructuredData = ({ type, data }) => {
  const generateWebSiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sarkari Result",
    "alternateName": "The Sarkari Result",
    "url": "https://thesarkariresult.info",
    "description": "Latest government job notifications, results, admit cards, answer keys, and recruitment updates for all government exams in India",
    "inLanguage": "en-IN",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true,
    "logo": {
      "@type": "ImageObject",
      "url": "https://thesarkariresult.info/icons/icon-512x512.png",
      "width": 512,
      "height": 512
    },
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
        }
      ]
    }
  });

  const generateOrganizationSchema = () => ({
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
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
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
  });

  const generateJobPostingSchema = (jobData) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": jobData.title,
    "description": jobData.description,
    "identifier": {
      "@type": "PropertyValue",
      "name": jobData.organization || "Government of India",
      "value": jobData.id || jobData.slug
    },
    "datePosted": jobData.publishedDate || jobData.createdAt,
    "validThrough": jobData.lastDate || jobData.applicationDeadline,
    "employmentType": jobData.employmentType || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": jobData.organization || "Government of India",
      "sameAs": jobData.organizationUrl || "https://india.gov.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://thesarkariresult.info/icons/icon-512x512.png"
      }
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": jobData.location || "India",
        "addressRegion": jobData.state || "India",
        "addressCountry": "IN"
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
    "qualifications": jobData.eligibility || jobData.qualifications,
    "responsibilities": jobData.jobDescription || jobData.description,
    "industry": "Government",
    "occupationalCategory": jobData.category || "Government Job",
    "workHours": jobData.workHours || "40 hours per week",
    "url": `https://thesarkariresult.info/jobs/${jobData.slug}`,
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "India"
    },
    "jobBenefits": [
      "Government Benefits",
      "Job Security",
      "Pension",
      "Medical Insurance"
    ]
  });

  const generateEventSchema = (eventData) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": eventData.title,
    "description": eventData.description,
    "startDate": eventData.startDate || eventData.examDate,
    "endDate": eventData.endDate || eventData.examDate,
    "eventStatus": "EventScheduled",
    "eventAttendanceMode": "OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": eventData.location || "Multiple Locations",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": eventData.organization || "Government of India",
      "url": eventData.organizationUrl || "https://india.gov.in"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://thesarkariresult.info/jobs/${eventData.slug}`,
      "price": eventData.applicationFee || "0",
      "priceCurrency": "INR",
      "availability": "InStock"
    },
    "image": "https://thesarkariresult.info/icons/icon-512x512.png"
  });

  const generateArticleSchema = (articleData) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.title,
    "description": articleData.description,
    "image": articleData.image || "https://thesarkariresult.info/icons/icon-512x512.png",
    "author": {
      "@type": "Person",
      "name": articleData.author || "Sarkari Result Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sarkari Result",
      "logo": {
        "@type": "ImageObject",
        "url": "https://thesarkariresult.info/icons/icon-512x512.png"
      }
    },
    "datePublished": articleData.publishedDate,
    "dateModified": articleData.modifiedDate || articleData.publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://thesarkariresult.info/${articleData.type}/${articleData.slug}`
    },
    "keywords": articleData.keywords,
    "articleSection": articleData.category,
    "wordCount": articleData.wordCount,
    "inLanguage": "en-IN"
  });

  const generateFAQSchema = (faqData) => ({
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
  });

  const generateBreadcrumbSchema = (breadcrumbs) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://thesarkariresult.info${crumb.url}`
    }))
  });

  const generateSearchResultsSchema = (searchData) => ({
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "url": `https://thesarkariresult.info/search?q=${searchData.query}`,
    "name": `Search Results for "${searchData.query}"`,
    "description": `Search results for ${searchData.query} on Sarkari Result`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": searchData.totalResults,
      "itemListElement": searchData.results?.slice(0, 10).map((result, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": result.url,
        "name": result.title,
        "description": result.description
      })) || []
    }
  });

  const generateGovernmentServiceSchema = (serviceData) => ({
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": serviceData.title,
    "description": serviceData.description,
    "provider": {
      "@type": "GovernmentOrganization",
      "name": serviceData.organization || "Government of India"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "job seekers",
      "geographicArea": {
        "@type": "Country",
        "name": "India"
      }
    },
    "serviceType": serviceData.serviceType || "Employment Service",
    "url": `https://thesarkariresult.info/${serviceData.type}/${serviceData.slug}`
  });

  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return generateWebSiteSchema();
      case 'organization':
        return generateOrganizationSchema();
      case 'job':
        return generateJobPostingSchema(data);
      case 'event':
        return generateEventSchema(data);
      case 'article':
        return generateArticleSchema(data);
      case 'faq':
        return generateFAQSchema(data);
      case 'breadcrumb':
        return generateBreadcrumbSchema(data);
      case 'search':
        return generateSearchResultsSchema(data);
      case 'government-service':
        return generateGovernmentServiceSchema(data);
      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
