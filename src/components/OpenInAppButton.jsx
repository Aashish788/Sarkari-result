import { useEffect } from 'react';

const AppRedirectHandler = ({ slug, type }) => {
  useEffect(() => {
    // Construct the deep link URL based on type
    let path = '';
    if (type === 'job') path = `/jobs/${slug}`;
    else if (type === 'result') path = `/results/${slug}`;
    else if (type === 'admit-card') path = `/admit-cards/${slug}`;
    else if (type === 'admission') path = `/admissions/${slug}`;
    else if (type === 'answer-key') path = `/answer-keys/${slug}`;
    else if (type === 'document') path = `/documents/${slug}`;

    const deepLinkUrl = `https://thesarkariresult.info${path}`;

    // Immediately try to open the app
    window.location.href = deepLinkUrl;

    // If app doesn't open within 2.5 seconds, redirect to Play Store
    const timeoutId = setTimeout(() => {
      if (!document.hidden) {
        // Use market protocol for direct Play Store app opening
        window.location.href = 'market://details?id=com.Sarkaribuddy.app';

        // Backup fallback to web Play Store
        setTimeout(() => {
          if (!document.hidden) {
            window.location.href = 'https://play.google.com/store/apps/details?id=com.Sarkaribuddy.app';
          }
        }, 1000);
      }
    }, 2500);

    // Cleanup timeout if component unmounts
    return () => clearTimeout(timeoutId);
  }, [slug, type]);

  // Return null - this component only handles redirection, no UI
  return null;
};

export default AppRedirectHandler;

