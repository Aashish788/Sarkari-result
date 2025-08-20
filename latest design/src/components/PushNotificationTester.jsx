import React, { useState, useEffect } from 'react';
// Dynamic imports for zero performance impact on main app
let pushUtils = null;

const PushNotificationTester = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // Load push utilities only when this component is actually used
    const loadPushUtils = async () => {
      if (!pushUtils) {
        try {
          pushUtils = await import('../utils/pushNotifications');
          console.log('Push notification utilities loaded for testing');
        } catch (error) {
          console.error('Failed to load push utilities:', error);
          return;
        }
      }
      checkSubscriptionStatus();
      loadStats();
    };
    
    loadPushUtils();
  }, []);

  const checkSubscriptionStatus = async () => {
    if (!pushUtils) return;
    try {
      const sub = await pushUtils.getPushSubscription();
      setSubscription(sub);
      setIsSubscribed(!!sub);
      setPermission(Notification.permission);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const loadStats = async () => {
    if (!pushUtils) return;
    try {
      const data = await pushUtils.getPushNotificationStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // First request permission if not granted
      if (!pushUtils.isNotificationPermissionGranted()) {
        const permissionGranted = await pushUtils.requestNotificationPermission();
        if (!permissionGranted) {
          setMessage('❌ Notification permission denied. Please enable notifications in browser settings.');
          setLoading(false);
          return;
        }
        setPermission(Notification.permission);
      }

      const sub = await pushUtils.subscribeToPushNotifications({
        newJobs: true,
        results: true,
        admitCards: true,
        answerKeys: true,
        generalUpdates: false
      });

      setSubscription(sub);
      setIsSubscribed(true);
      setMessage('✅ Successfully subscribed to push notifications!');
      await loadStats(); // Refresh stats
    } catch (error) {
      setMessage(`❌ Subscription failed: ${error.message}`);
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      await pushUtils.unsubscribeFromPushNotifications();
      setSubscription(null);
      setIsSubscribed(false);
      setMessage('✅ Successfully unsubscribed from push notifications');
      await loadStats(); // Refresh stats
    } catch (error) {
      setMessage(`❌ Unsubscribe failed: ${error.message}`);
      console.error('Unsubscribe error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      await pushUtils.sendTestNotification();
      setMessage('✅ Test notification sent! Check your device for the notification.');
    } catch (error) {
      setMessage(`❌ Test notification failed: ${error.message}`);
      console.error('Test notification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPermissionStatusColor = () => {
    switch (permission) {
      case 'granted': return 'text-green-600';
      case 'denied': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getPermissionStatusText = () => {
    switch (permission) {
      case 'granted': return '✅ Granted';
      case 'denied': return '❌ Denied';
      default: return '⚠️ Not requested';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🧪 Push Notification Tester</h2>
      
      {/* Current Status */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Current Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="block text-sm text-gray-600">Permission:</span>
            <span className={`font-medium ${getPermissionStatusColor()}`}>
              {getPermissionStatusText()}
            </span>
          </div>
          <div>
            <span className="block text-sm text-gray-600">Subscription:</span>
            <span className={`font-medium ${isSubscribed ? 'text-green-600' : 'text-red-600'}`}>
              {isSubscribed ? '✅ Subscribed' : '❌ Not subscribed'}
            </span>
          </div>
          <div>
            <span className="block text-sm text-gray-600">Service Worker:</span>
            <span className="font-medium text-blue-600">
              {'serviceWorker' in navigator ? '✅ Supported' : '❌ Not supported'}
            </span>
          </div>
        </div>
        
        {subscription && (
          <div className="mt-3">
            <span className="block text-sm text-gray-600">Endpoint:</span>
            <span className="text-xs text-gray-500 break-all">
              {subscription.endpoint.substring(0, 100)}...
            </span>
          </div>
        )}
      </div>

      {/* Statistics */}
      {stats && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">System Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="block text-sm text-blue-600">Total Subscriptions</span>
              <span className="text-xl font-bold text-blue-900">{stats.total_subscriptions || 0}</span>
            </div>
            <div>
              <span className="block text-sm text-green-600">Active</span>
              <span className="text-xl font-bold text-green-900">{stats.active_subscriptions || 0}</span>
            </div>
            <div>
              <span className="block text-sm text-purple-600">Job Notifications</span>
              <span className="text-xl font-bold text-purple-900">{stats.new_jobs_enabled || 0}</span>
            </div>
            <div>
              <span className="block text-sm text-orange-600">Result Notifications</span>
              <span className="text-xl font-bold text-orange-900">{stats.results_enabled || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        {!isSubscribed ? (
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Subscribing...' : '📱 Subscribe to Notifications'}
          </button>
        ) : (
          <>
            <button
              onClick={handleTestNotification}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : '🧪 Send Test Notification'}
            </button>
            <button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Unsubscribing...' : '🗑️ Unsubscribe'}
            </button>
          </>
        )}
        
        <button
          onClick={() => {
            checkSubscriptionStatus();
            loadStats();
          }}
          className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700"
        >
          🔄 Refresh Status
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('✅') 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message}
        </div>
      )}

      {/* Troubleshooting Steps */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-yellow-800">🔧 Troubleshooting Steps</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
          <li>
            <strong>Enable Notifications:</strong> Make sure your browser allows notifications for this site
          </li>
          <li>
            <strong>Use HTTPS:</strong> Push notifications only work on HTTPS or localhost
          </li>
          <li>
            <strong>Service Worker:</strong> Check browser console for service worker errors
          </li>
          <li>
            <strong>Subscribe First:</strong> You must subscribe before sending notifications
          </li>
          <li>
            <strong>Check Network:</strong> Ensure connection to Supabase is working
          </li>
        </ol>
        
        <div className="mt-4 p-3 bg-yellow-100 rounded">
          <strong>Quick Test:</strong> After subscribing, go to Admin Dashboard → Push Notifications and send a test notification.
        </div>
      </div>
    </div>
  );
};

export default PushNotificationTester; 