const fs = require('fs');
const path = require('path');

// Generate comprehensive sitemap.xml
const generateSitemap = () => {
  const baseUrl = 'https://thesarkariresult.info';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages with their priorities and change frequencies
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily', lastmod: currentDate },
    { url: '/jobs', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
    { url: '/results', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
    { url: '/admit-card', priority: '0.8', changefreq: 'daily', lastmod: currentDate },
    { url: '/answer-key', priority: '0.8', changefreq: 'daily', lastmod: currentDate },
    { url: '/admission', priority: '0.8', changefreq: 'daily', lastmod: currentDate },
    { url: '/syllabus', priority: '0.7', changefreq: 'weekly', lastmod: currentDate },
    { url: '/documents', priority: '0.7', changefreq: 'weekly', lastmod: currentDate },
    { url: '/search', priority: '0.6', changefreq: 'weekly', lastmod: currentDate },
    { url: '/contact', priority: '0.5', changefreq: 'monthly', lastmod: currentDate },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly', lastmod: currentDate },
    { url: '/disclaimer', priority: '0.3', changefreq: 'yearly', lastmod: currentDate }
  ];

  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Add static pages
  staticPages.forEach(page => {
    sitemapXML += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <mobile:mobile/>
  </url>
`;
  });

  // Add sample dynamic pages (these would be generated from your database in production)
  const sampleJobs = [
    'ssc-cgl-2025', 'upsc-civil-services-2025', 'railway-group-d-2025',
    'bank-po-2025', 'police-constable-2025', 'teacher-recruitment-2025'
  ];

  const sampleResults = [
    'ssc-cgl-result-2024', 'upsc-prelims-result-2024', 'railway-ntpc-result-2024',
    'bank-clerk-result-2024', 'police-result-2024', 'teacher-result-2024'
  ];

  const sampleAdmitCards = [
    'ssc-cgl-admit-card-2025', 'upsc-admit-card-2025', 'railway-admit-card-2025',
    'bank-exam-admit-card-2025', 'police-admit-card-2025'
  ];

  const sampleAnswerKeys = [
    'ssc-cgl-answer-key-2024', 'upsc-answer-key-2024', 'railway-answer-key-2024',
    'bank-answer-key-2024', 'police-answer-key-2024'
  ];

  // Add dynamic job pages
  sampleJobs.forEach(job => {
    sitemapXML += `  <url>
    <loc>${baseUrl}/jobs/${job}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <mobile:mobile/>
  </url>
`;
  });

  // Add dynamic result pages
  sampleResults.forEach(result => {
    sitemapXML += `  <url>
    <loc>${baseUrl}/results/${result}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <mobile:mobile/>
  </url>
`;
  });

  // Add dynamic admit card pages
  sampleAdmitCards.forEach(admitCard => {
    sitemapXML += `  <url>
    <loc>${baseUrl}/admit-cards/${admitCard}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>
`;
  });

  // Add dynamic answer key pages
  sampleAnswerKeys.forEach(answerKey => {
    sitemapXML += `  <url>
    <loc>${baseUrl}/answer-keys/${answerKey}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>
`;
  });

  sitemapXML += '</urlset>';

  return sitemapXML;
};

// Generate robots.txt
const generateRobotsTxt = () => {
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

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$
Disallow: /*?*utm_*
Disallow: /*?*ref=*
Disallow: /search?*

# Allow important files
Allow: /sitemap.xml
Allow: /robots.txt
Allow: /manifest.json
Allow: /sw.js
Allow: /ads.txt
Allow: /favicon.ico
Allow: /*.css
Allow: /*.js
Allow: /*.png
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.gif
Allow: /*.svg
Allow: /*.webp

# Sitemap location
Sitemap: https://thesarkariresult.info/sitemap.xml

# Crawl delay for better server performance
Crawl-delay: 1

# Host specification
Host: https://thesarkariresult.info`;
};

// Generate ads.txt for Google AdSense
const generateAdsTxt = () => {
  return `# ads.txt file for thesarkariresult.info
# This file helps prevent counterfeit inventory from being sold on unauthorized sites

# Google AdSense
google.com, pub-XXXXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0

# Replace pub-XXXXXXXXXXXXXXXXXX with your actual Google AdSense Publisher ID
# Add other ad networks as needed

# Format: domain, publisher_id, relationship, tag_id`;
};

// Write files to public directory
const writeFiles = () => {
  const publicDir = path.join(__dirname, '..', 'public');
  
  // Generate and write sitemap.xml
  const sitemap = generateSitemap();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ sitemap.xml generated successfully');

  // Generate and write robots.txt
  const robotsTxt = generateRobotsTxt();
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('✅ robots.txt generated successfully');

  // Generate and write ads.txt
  const adsTxt = generateAdsTxt();
  fs.writeFileSync(path.join(publicDir, 'ads.txt'), adsTxt);
  console.log('✅ ads.txt generated successfully');

  console.log('\n🚀 All SEO files generated successfully!');
  console.log('📍 Files location: public/');
  console.log('   - sitemap.xml');
  console.log('   - robots.txt');
  console.log('   - ads.txt');
};

// Run the generator
writeFiles();

module.exports = {
  generateSitemap,
  generateRobotsTxt,
  generateAdsTxt,
  writeFiles
};
