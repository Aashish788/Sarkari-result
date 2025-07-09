// Push Notification Utilities for Sarkari Result PWA

import { supabase } from '../supabaseClient';

const VAPID_PUBLIC_KEY = 'BGgofMgkpXyiVm2ar_WyjLJyBkbiDYsDfrVXxbbDsj_XyzB5rHtqD70zZoFhhHamDrwspm72UorgqHjr27qY0-U';
const EDGE_FUNCTION_URL = 'https://ardnhnxyvyebezfjwpgn.supabase.co/functions/v1/push-notifications';

// Check if push notifications are supported
export const isPushNotificationSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications are not supported in this browser');
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// Get push subscription
export const getPushSubscription = async () => {
  if (!isPushNotificationSupported()) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error('Error getting push subscription:', error);
    return null;
  }
};

// Subscribe to push notifications using server-side API
export const subscribeToPushNotifications = async (preferences = {}) => {
  try {
    if (!isPushNotificationSupported()) {
      throw new Error('Push notifications are not supported');
    }

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      throw new Error('Notification permission denied');
    }

    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    // Send subscription to server-side API
    const subscriptionData = {
      endpoint: subscription.endpoint,
      p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
      auth: arrayBufferToBase64(subscription.getKey('auth')),
      preferences: {
        newJobs: true,
        results: true,
        admitCards: true,
        answerKeys: true,
        generalUpdates: false,
        ...preferences
      },
      userAgent: navigator.userAgent,
      ipAddress: null // Will be detected server-side
    };

    const response = await fetch(`${EDGE_FUNCTION_URL}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify(subscriptionData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to subscribe');
    }

    // Store subscription locally
    localStorage.setItem('pushSubscription', JSON.stringify(subscriptionData));

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
};

// Unsubscribe from push notifications using server-side API
export const unsubscribeFromPushNotifications = async () => {
  try {
    const subscription = await getPushSubscription();
    if (!subscription) {
      return true;
    }

    // Unsubscribe from browser
    await subscription.unsubscribe();

    // Remove from server using API
    const response = await fetch(`${EDGE_FUNCTION_URL}/unsubscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify({ endpoint: subscription.endpoint })
    });

    if (!response.ok) {
      const result = await response.json();
      console.error('Error unsubscribing from server:', result.error);
    }

    // Remove from local storage
    localStorage.removeItem('pushSubscription');

    return true;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    throw error;
  }
};

// Update notification preferences using server-side API
export const updateNotificationPreferences = async (preferences) => {
  try {
    const subscription = await getPushSubscription();
    if (!subscription) {
      throw new Error('No active subscription found');
    }

    const response = await fetch(`${EDGE_FUNCTION_URL}/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        preferences
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update preferences');
    }

    // Update local storage
    const localSub = JSON.parse(localStorage.getItem('pushSubscription') || '{}');
    localSub.preferences = preferences;
    localStorage.setItem('pushSubscription', JSON.stringify(localSub));

    return true;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

// Get current notification preferences
export const getNotificationPreferences = async () => {
  try {
    const subscription = await getPushSubscription();
    if (!subscription) {
      return null;
    }

    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('preferences')
      .eq('endpoint', subscription.endpoint)
      .eq('is_active', true)
      .single();

    if (error) {
      throw error;
    }

    return data?.preferences || null;
  } catch (error) {
    console.error('Error getting preferences:', error);
    // Fallback to local storage
    const localSub = JSON.parse(localStorage.getItem('pushSubscription') || '{}');
    return localSub.preferences || null;
  }
};

// Send test notification using server-side API
export const sendTestNotification = async () => {
  try {
    const subscription = await getPushSubscription();
    if (!subscription) {
      throw new Error('No active subscription found');
    }

    const response = await fetch(`${EDGE_FUNCTION_URL}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify({ endpoint: subscription.endpoint })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send test notification');
    }

    return result;
  } catch (error) {
    console.error('Error sending test notification:', error);
    
    // Fallback to local notification
    if (!isPushNotificationSupported()) {
      throw new Error('Push notifications are not supported');
    }

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      throw new Error('Notification permission denied');
    }

    const notification = new Notification('Test Notification', {
      body: 'This is a test notification from Sarkari Result PWA!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: 'test-notification',
      data: { url: '/', test: true }
    });

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
    };

    return notification;
  }
};

// Send notification to all subscribers (admin function)
export const sendNotificationToAll = async (notification) => {
  try {
    const response = await fetch(`${EDGE_FUNCTION_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`
      },
      body: JSON.stringify(notification)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send notification');
    }

    return result;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// Get push notification statistics (admin function)
export const getPushNotificationStats = async () => {
  try {
    const response = await fetch(`${EDGE_FUNCTION_URL}/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabase.supabaseKey}`
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get stats');
    }

    return result.stats;
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
};

// Legacy compatibility functions
export const isNotificationPermissionGranted = () => {
  return Notification.permission === 'granted';
};

export const getCurrentSubscription = getPushSubscription;

export const showLocalNotification = (title, options = {}) => {
  if (!isPushNotificationSupported() || !isNotificationPermissionGranted()) {
    console.warn('Cannot show notification: not supported or permission not granted');
    return;
  }

  const notification = new Notification(title, {
    body: 'New government job notification available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: { url: '/', timestamp: Date.now() },
    ...options
  });

  notification.onclick = (event) => {
    event.preventDefault();
    window.focus();
    notification.close();
    if (options.url) {
      window.location.href = options.url;
    }
  };

  return notification;
};

export const initializePushNotifications = async () => {
  try {
    if (!isPushNotificationSupported()) {
      console.log('Push notifications not supported');
      return false;
    }

    // Check if service worker is registered
    const registration = await navigator.serviceWorker.ready;
    if (!registration) {
      console.log('Service worker not registered');
      return false;
    }

    // Check if already subscribed
    const subscription = await getPushSubscription();
    if (subscription) {
      console.log('Already subscribed to push notifications');
      return true;
    }

    console.log('Push notifications initialized, ready to subscribe');
    return true;
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return false;
  }
};

// Notification preferences manager
export const NotificationPreferences = {
  getPreferences() {
    const saved = localStorage.getItem('pushSubscription');
    if (saved) {
      const data = JSON.parse(saved);
      return data.preferences || {};
    }
    return {
      newJobs: true,
      results: true,
      admitCards: true,
      answerKeys: true,
      generalUpdates: false
    };
  },

  async setPreferences(preferences) {
    try {
      await updateNotificationPreferences(preferences);
      return true;
    } catch (error) {
      console.error('Error setting preferences:', error);
      return false;
    }
  },

  updatePreference(key, value) {
    const current = this.getPreferences();
    current[key] = value;
    return this.setPreferences(current);
  }
};

// Utility functions
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}; 