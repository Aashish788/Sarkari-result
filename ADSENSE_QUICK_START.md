# Quick Start: Adding AdSense to Your Pages

## Step 1: Import the Ad Components

```javascript
import { TopBannerAd, InArticleAd, BottomAd, SidebarAd } from "./AdSenseAd";
```

## Step 2: Add Ads to Your Component

### For Detail Pages (Jobs, Results, Admit Cards, etc.):

```javascript
const JobDetails = () => {
  // ... your code ...

  return (
    <>
      <div className="job-details-container">
        {/* Top Banner Ad */}
        <TopBannerAd slot="YOUR_SLOT_ID_HERE" />

        {/* Your content introduction */}
        <div className="job-introduction">
          <p>Your introduction with at least 150+ words...</p>
        </div>

        {/* First sections of content */}
        <div className="job-section">
          <h2>Important Dates</h2>
          {/* ... */}
        </div>

        <div className="job-section">
          <h2>Post Details</h2>
          {/* ... */}
        </div>

        {/* In-Article Ad (after substantial content) */}
        <InArticleAd slot="YOUR_SLOT_ID_HERE" />

        {/* More content sections */}
        <div className="job-section">
          <h2>Selection Process</h2>
          {/* ... */}
        </div>

        <div className="job-section">
          <h2>Important Links</h2>
          {/* ... */}
        </div>

        {/* Bottom Ad (before footer area) */}
        <BottomAd slot="YOUR_SLOT_ID_HERE" />
      </div>
    </>
  );
};
```

### For Listing Pages (JobsPage, ResultsPage, etc.):

```javascript
const JobsPage = () => {
  return (
    <div className="page-container">
      <h1>Latest Jobs</h1>

      {/* Rich introduction content (required!) */}
      <div className="page-introduction">
        <p>Comprehensive introduction with 200+ words about jobs...</p>
        <p>More helpful information for users...</p>
      </div>

      {/* Search box */}
      <div className="search-container">
        <input type="text" placeholder="Search..." />
      </div>

      {/* Top Banner Ad */}
      <TopBannerAd slot="YOUR_SLOT_ID_HERE" />

      {/* Your listings */}
      <div className="items-grid">
        {jobs.map((job) => (
          <div key={job.id} className="item-card">
            {/* ... */}
          </div>
        ))}
      </div>

      {/* Bottom Ad */}
      <BottomAd slot="YOUR_SLOT_ID_HERE" />
    </div>
  );
};
```

## Step 3: Ensure Content Quality

### Required Elements for Ads to Show:

1. **Minimum 300 words** of meaningful text content
2. **At least 3 substantial paragraphs** (15+ words each)
3. **Proper headings** (h1, h2, h3)
4. **Internal links** (at least 2)
5. **Structured content** (tables, lists, sections)
6. **Metadata** (title, description in Helmet)

### Example of Good Content Structure:

```javascript
<div className="page-introduction">
  <p>
    First paragraph with at least 50 words introducing the topic, explaining
    what users will find, and providing context...
  </p>
  <p>
    Second paragraph with more details, helping users understand the purpose,
    how to use the page, and what to expect...
  </p>
  <p>
    Third paragraph with additional information, tips, guidelines, or helpful
    resources for users...
  </p>
</div>
```

## Step 4: Replace Placeholder IDs

### In AdSenseAd.jsx (Line 136):

```javascript
// Before:
data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"

// After (use YOUR publisher ID):
data-ad-client="ca-pub-1234567890123456"
```

### In your components:

```javascript
// Before:
<TopBannerAd slot="YOUR_SLOT_ID_HERE" />

// After (use YOUR ad unit slot):
<TopBannerAd slot="1234567890" />
```

## Step 5: Test Your Implementation

### Development Testing:

1. Run `npm start`
2. Open browser console
3. Look for "AdSense Content Quality Analysis" logs
4. Check quality score (must be >= 70)
5. Verify ad placeholders appear

### Production Testing:

1. Deploy your site
2. Wait 24-48 hours after AdSense approval
3. Ads should appear automatically
4. Check on multiple devices

## Common Mistakes to Avoid

❌ **Don't do this:**

- Add ads without sufficient content
- Use ads on navigation/error pages
- Place too many ads per page
- Add ads immediately on page load

✅ **Do this instead:**

- Add rich, helpful content first
- Only use ads on content pages
- Limit to 3-4 ad units per page
- Wait 2 seconds before showing ads

## Quick Checklist

Before adding ads to a page:

- [ ] Page has 300+ words of content
- [ ] Has proper headings (h1, h2, h3)
- [ ] Has at least 3 substantial paragraphs
- [ ] Contains helpful information
- [ ] Has internal/external links
- [ ] Has proper metadata
- [ ] Not a navigation/error page
- [ ] Not under construction

## Example: Complete Working Page

```javascript
import React from "react";
import { Helmet } from "react-helmet-async";
import { TopBannerAd, InArticleAd, BottomAd } from "./AdSenseAd";

const MyPage = () => {
  return (
    <>
      <Helmet>
        <title>My Page Title - Site Name</title>
        <meta name="description" content="Detailed description of my page..." />
      </Helmet>

      <div className="page-container">
        <h1>My Page Title</h1>

        {/* REQUIRED: Rich introduction */}
        <div className="page-introduction">
          <p>
            Welcome to our comprehensive guide about this topic. This page
            provides detailed information, helpful tips, and everything you need
            to know. We've carefully compiled all the essential details to help
            you understand and make informed decisions. Whether you're a
            beginner or experienced, you'll find valuable insights here.
          </p>
          <p>
            Our platform is designed to offer accurate, up-to-date information
            that you can trust. We update our content regularly to ensure you
            always have access to the latest data. Browse through the sections
            below to find specific information you're looking for.
          </p>
          <p>
            Don't forget to bookmark this page and check back regularly for
            updates. We also recommend exploring our other sections to discover
            more helpful resources and tools. Your success is our priority.
          </p>
        </div>

        {/* Top Ad */}
        <TopBannerAd slot="1234567890" />

        {/* Main Content */}
        <div className="content-section">
          <h2>Section 1: Important Information</h2>
          <p>Your content here...</p>
          <ul>
            <li>Point 1 with details</li>
            <li>Point 2 with details</li>
            <li>Point 3 with details</li>
          </ul>
        </div>

        <div className="content-section">
          <h2>Section 2: More Details</h2>
          <p>More content here...</p>
          <table>{/* Your table */}</table>
        </div>

        {/* In-Article Ad */}
        <InArticleAd slot="9876543210" />

        <div className="content-section">
          <h2>Section 3: Additional Resources</h2>
          <p>Even more content here...</p>
        </div>

        {/* Bottom Ad */}
        <BottomAd slot="5555555555" />
      </div>
    </>
  );
};

export default MyPage;
```

## Need Help?

1. Check browser console for quality score
2. Review ADSENSE_IMPLEMENTATION_GUIDE.md
3. Ensure all required content is present
4. Test in incognito mode (disable ad blockers)
5. Wait 2-3 seconds on page for ads to load

## Remember

The system automatically:

- ✅ Validates content quality
- ✅ Prevents ads on low-quality pages
- ✅ Checks word count and structure
- ✅ Ensures policy compliance
- ✅ Blocks ads on inappropriate pages

You just need to:

1. Add rich, helpful content
2. Import and place ad components
3. Use your actual slot IDs
4. Test and verify

That's it! You're ready to go! 🚀
