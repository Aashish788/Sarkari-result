import React, { useState, useEffect } from 'react';
import {
  isPushNotificationSupported,
  isNotificationPermissionGranted,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getCurrentSubscription,
  NotificationPreferences,
  showLocalNotification
} from '../utils/pushNotifications';

const NotificationSettings = ({ isOpen, onClose }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState(NotificationPreferences.getPreferences());

  useEffect(() => {
    const checkNotificationStatus = async () => {
      setIsSupported(isPushNotificationSupported());
      
      if (isPushNotificationSupported()) {
        const subscription = await getCurrentSubscription();
        setIsSubscribed(!!subscription);
      }
    };

    checkNotificationStatus();
  }, []);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await subscribeToPushNotifications();
      setIsSubscribed(true);
      
      // Show test notification
      showLocalNotification('Notifications Enabled!', {
        body: 'You\'ll now receive updates about new government jobs and results.',
        icon: '/icons/icon-192x192.png'
      });
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Failed to enable notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      await unsubscribeFromPushNotifications();
      setIsSubscribed(false);
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      alert('Failed to disable notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    NotificationPreferences.setPreferences(newPreferences);
  };

  const handleTestNotification = () => {
    showLocalNotification('Test Notification', {
      body: 'This is a test notification from Sarkari Result.',
      icon: '/icons/icon-192x192.png',
      data: { url: '/' }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="notification-settings-overlay">
      <div className="notification-settings-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-bell"></i>
            Notification Settings
          </h2>
          <button onClick={onClose} className="close-button">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-content">
          {!isSupported ? (
            <div className="not-supported">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Notifications Not Supported</h3>
              <p>Your browser doesn't support push notifications. Please use a modern browser like Chrome, Firefox, or Safari.</p>
            </div>
          ) : (
            <>
              <div className="subscription-section">
                <div className="section-header">
                  <h3>Push Notifications</h3>
                  <div className={`status-badge ${isSubscribed ? 'enabled' : 'disabled'}`}>
                    {isSubscribed ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                
                <p>
                  Get instant notifications for new government jobs, exam results, admit cards, and answer keys.
                </p>

                <div className="subscription-actions">
                  {!isSubscribed ? (
                    <button 
                      onClick={handleSubscribe} 
                      disabled={isLoading}
                      className="subscribe-button"
                    >
                      {isLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Enabling...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-bell"></i>
                          Enable Notifications
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="subscribed-actions">
                      <button 
                        onClick={handleTestNotification}
                        className="test-button"
                      >
                        <i className="fas fa-test"></i>
                        Test Notification
                      </button>
                      <button 
                        onClick={handleUnsubscribe} 
                        disabled={isLoading}
                        className="unsubscribe-button"
                      >
                        {isLoading ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i>
                            Disabling...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-bell-slash"></i>
                            Disable Notifications
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isSubscribed && (
                <div className="preferences-section">
                  <h3>Notification Preferences</h3>
                  <p>Choose what types of notifications you want to receive:</p>

                  <div className="preference-list">
                    <div className="preference-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={preferences.newJobs}
                          onChange={(e) => handlePreferenceChange('newJobs', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <div className="preference-info">
                          <strong>New Jobs</strong>
                          <span>Latest government job notifications</span>
                        </div>
                      </label>
                    </div>

                    <div className="preference-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={preferences.results}
                          onChange={(e) => handlePreferenceChange('results', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <div className="preference-info">
                          <strong>Exam Results</strong>
                          <span>Notifications when new results are published</span>
                        </div>
                      </label>
                    </div>

                    <div className="preference-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={preferences.admitCards}
                          onChange={(e) => handlePreferenceChange('admitCards', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <div className="preference-info">
                          <strong>Admit Cards</strong>
                          <span>When admit cards are available for download</span>
                        </div>
                      </label>
                    </div>

                    <div className="preference-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={preferences.answerKeys}
                          onChange={(e) => handlePreferenceChange('answerKeys', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <div className="preference-info">
                          <strong>Answer Keys</strong>
                          <span>When official answer keys are released</span>
                        </div>
                      </label>
                    </div>

                    <div className="preference-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={preferences.generalUpdates}
                          onChange={(e) => handlePreferenceChange('generalUpdates', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <div className="preference-info">
                          <strong>General Updates</strong>
                          <span>App updates and general announcements</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .notification-settings-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .notification-settings-modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0 24px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 20px;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .modal-content {
          padding: 0 24px 24px 24px;
        }

        .not-supported {
          text-align: center;
          padding: 40px 20px;
          color: #ef4444;
        }

        .not-supported i {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .subscription-section {
          margin-bottom: 32px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .section-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.enabled {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.disabled {
          background: #fee2e2;
          color: #991b1b;
        }

        .subscription-actions {
          margin-top: 16px;
        }

        .subscribe-button, .test-button, .unsubscribe-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-right: 12px;
          margin-bottom: 8px;
        }

        .subscribe-button {
          background: #1e40af;
          color: white;
        }

        .subscribe-button:hover:not(:disabled) {
          background: #1e3a8a;
        }

        .test-button {
          background: #059669;
          color: white;
        }

        .test-button:hover {
          background: #047857;
        }

        .unsubscribe-button {
          background: #dc2626;
          color: white;
        }

        .unsubscribe-button:hover:not(:disabled) {
          background: #b91c1c;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .preferences-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 24px;
        }

        .preferences-section h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .preferences-section p {
          margin: 0 0 20px 0;
          color: #6b7280;
        }

        .preference-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .preference-item label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 12px;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .preference-item label:hover {
          background: #f9fafb;
        }

        .preference-item input[type="checkbox"] {
          display: none;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          position: relative;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .preference-item input:checked + .checkmark {
          background: #1e40af;
          border-color: #1e40af;
        }

        .preference-item input:checked + .checkmark::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: 600;
        }

        .preference-info {
          flex: 1;
        }

        .preference-info strong {
          display: block;
          color: #1f2937;
          margin-bottom: 2px;
        }

        .preference-info span {
          color: #6b7280;
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .notification-settings-overlay {
            padding: 10px;
          }

          .modal-header {
            padding: 20px 20px 0 20px;
          }

          .modal-content {
            padding: 0 20px 20px 20px;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .subscribe-button, .test-button, .unsubscribe-button {
            width: 100%;
            justify-content: center;
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationSettings; 