import { useEffect } from 'react';

const AppRedirectHandler = ({ slug, type }) => {
  useEffect(() => {
    // Construct app-specific intent URL for instant opening
    let intentUrl = '';
    if (type === 'job') intentUrl = `intent://job/${slug}#Intent;scheme=https;package=com.Sarkaribuddy.app;end`;
    else if (type === 'result') intentUrl = `intent://result/${slug}#Intent;scheme=https;package=com.Sarkaribuddy.app;end`;
    else if (type === 'admit-card') intentUrl = `intent://admit-card/${slug}#Intent;scheme=https;package=com.Sarkaribuddy.app;end`;
    else if (type === 'admission') intentUrl = `intent://admission/${slug}#Intent;scheme=https;package=com.Sarkaribuddy.app;end`;
    else if (type === 'answer-key') intentUrl = `intent://answer-key/${slug}#Intent;scheme=https;package=com.Sarkaribuddy.app;end`;
    else if (type === 'document') intentUrl = `intent://document/${slug}#Intent;scheme=https;package=com.Sarkaribuddy.app;end`;

    // Try to open app instantly using Android Intent
    window.location.href = intentUrl;

    // If app doesn't open within 1 second, redirect to Play Store
    const timeoutId = setTimeout(() => {
      // Use market protocol for direct Play Store app opening
      window.location.href = 'market://details?id=com.Sarkaribuddy.app';

      // Backup fallback to web Play Store
      setTimeout(() => {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.Sarkaribuddy.app';
      }, 500);
    }, 1000); // Reduced from 2.5s to 1s for faster response

    // Cleanup timeout if component unmounts
    return () => clearTimeout(timeoutId);
  }, [slug, type]);

  // Return null - this component only handles redirection, no UI
  return null;
};

export default AppRedirectHandler;

