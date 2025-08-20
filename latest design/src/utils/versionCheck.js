// Version check utility for forcing PWA updates
const APP_VERSION = '2.0.0-realtime';
const VERSION_KEY = 'app_version';

export const checkForUpdates = () => {
  const currentVersion = localStorage.getItem(VERSION_KEY);
  
  if (currentVersion !== APP_VERSION) {
    console.log('App version changed from', currentVersion, 'to', APP_VERSION);
    
    // Clear all caches when version changes
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          console.log('Clearing cache:', name);
          caches.delete(name);
        });
      });
    }
    
    // Clear localStorage data that might be stale
    const keysToKeep = ['auth_tokens', 'user_preferences'];
    Object.keys(localStorage).forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    // Update version
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    
    // Force service worker update
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.update();
        });
      });
    }
    
    return true; // Indicates update occurred
  }
  
  return false; // No update needed
};

export const forceRefresh = () => {
  // Force a hard refresh without cache
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
      });
      window.location.reload(true);
    });
  } else {
    window.location.reload(true);
  }
};

export const getCurrentVersion = () => APP_VERSION; 