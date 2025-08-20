import React, { useState, useEffect } from 'react';
import { sendNotificationToAll, getPushNotificationStats } from '../utils/pushNotifications';

const PushNotificationAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    title: '',
    body: '',
    category: 'generalUpdates',
    url: '/',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    image: ''
  });
  const [sendStatus, setSendStatus] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getPushNotificationStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSendStatus(null);

    try {
      const result = await sendNotificationToAll({
        title: notification.title,
        body: notification.body,
        category: notification.category,
        icon: notification.icon,
        badge: notification.badge,
        image: notification.image || null,
        url: notification.url,
        data: {
          timestamp: Date.now(),
          admin: true
        }
      });

      setSendStatus({
        type: 'success',
        message: `Notification sent successfully! Sent to ${result.sent} users, ${result.failed} failed.`,
        data: result
      });

      // Reset form
      setNotification({
        title: '',
        body: '',
        category: 'generalUpdates',
        url: '/',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        image: ''
      });

      // Reload stats
      setTimeout(loadStats, 1000);

    } catch (error) {
      setSendStatus({
        type: 'error',
        message: `Failed to send notification: ${error.message}`,
        data: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const presetNotifications = {
    newJob: {
      title: 'New Government Job Available!',
      body: 'Check out the latest government job opportunities.',
      category: 'newJobs',
      url: '/'
    },
    result: {
      title: 'New Exam Results Published!',
      body: 'Check your exam results now.',
      category: 'results',
      url: '/'
    },
    admitCard: {
      title: 'New Admit Card Available!',
      body: 'Download your admit card now.',
      category: 'admitCards',
      url: '/'
    },
    answerKey: {
      title: 'Answer Key Released!',
      body: 'Check the answer key for your exam.',
      category: 'answerKeys',
      url: '/'
    }
  };

  const applyPreset = (preset) => {
    setNotification(prev => ({
      ...prev,
      ...presetNotifications[preset]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Push Notification Management</h2>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Total Subscriptions</h3>
          <p className="text-2xl font-bold text-blue-900">
            {stats?.total_subscriptions || 0}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">Active Subscriptions</h3>
          <p className="text-2xl font-bold text-green-900">
            {stats?.active_subscriptions || 0}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-600">Job Notifications</h3>
          <p className="text-2xl font-bold text-purple-900">
            {stats?.new_jobs_enabled || 0}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-orange-600">Result Notifications</h3>
          <p className="text-2xl font-bold text-orange-900">
            {stats?.results_enabled || 0}
          </p>
        </div>
      </div>

      {/* Send Notification Form */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send New Notification</h3>

        {/* Preset Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets:</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(presetNotifications).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                {preset.title.split('!')[0]}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSendNotification} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={notification.title}
                onChange={handleInputChange}
                required
                maxLength={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notification title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={notification.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newJobs">New Jobs</option>
                <option value="results">Results</option>
                <option value="admitCards">Admit Cards</option>
                <option value="answerKeys">Answer Keys</option>
                <option value="generalUpdates">General Updates</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              name="body"
              value={notification.body}
              onChange={handleInputChange}
              required
              maxLength={300}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notification message"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="text"
                name="url"
                value={notification.url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Click destination URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (optional)
              </label>
              <input
                type="url"
                name="image"
                value={notification.image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon URL
              </label>
              <input
                type="text"
                name="icon"
                value={notification.icon}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge URL
              </label>
              <input
                type="text"
                name="badge"
                value={notification.badge}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-600">
              Will be sent to {stats?.active_subscriptions || 0} active subscribers
              {notification.category !== 'generalUpdates' && (
                <span className="block">
                  ({stats?.[`${notification.category.replace(/([A-Z])/g, '_$1').toLowerCase()}_enabled`] || 0} have this category enabled)
                </span>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading || !notification.title || !notification.body}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </form>

        {/* Status Message */}
        {sendStatus && (
          <div className={`mt-4 p-4 rounded-md ${
            sendStatus.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {sendStatus.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{sendStatus.message}</p>
                {sendStatus.data && (
                  <div className="mt-2 text-xs">
                    <p>Notification ID: {sendStatus.data.notificationId}</p>
                    <p>Total Recipients: {sendStatus.data.totalRecipients}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Statistics */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Admit Cards:</span>
            <span className="font-medium">{stats?.admit_cards_enabled || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Answer Keys:</span>
            <span className="font-medium">{stats?.answer_keys_enabled || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">General Updates:</span>
            <span className="font-medium">{stats?.general_updates_enabled || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Inactive:</span>
            <span className="font-medium">{stats?.inactive_subscriptions || 0}</span>
          </div>
        </div>
        
        <button
          onClick={loadStats}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Refresh Statistics
        </button>
      </div>
    </div>
  );
};

export default PushNotificationAdmin; 