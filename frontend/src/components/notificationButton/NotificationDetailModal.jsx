import React, { useEffect, useState } from 'react';
import { notificationApi } from '../../api/services/notificationApi';

const NotificationDetailModal = ({ notificationId, onClose, onMarkAsRead }) => {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!notificationId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await notificationApi.getById(notificationId);
        if (!data || !data.data.id) {
          setError("Notification not found.");
          return;
        }

        setNotification(data.data);

        if (!data.isRead) {
          await notificationApi.markAsRead(notificationId);
          if (onMarkAsRead) onMarkAsRead(notificationId);
        }
      } catch (err) {
        setError("Failed to load notification details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [notificationId, onMarkAsRead]);

  if (!notificationId) return null;

  return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] px-4">
    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-3xl relative border border-gray-300 overflow-y-auto max-h-[90vh]">
      {loading && <p className="text-center text-gray-700 text-base">Loading details...</p>}
      {error && <p className="text-red-500 text-center text-base">{error}</p>}

      {!loading && !error && notification && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-red-600 border-b pb-2">
            {notification.title}
          </h2>
          <div className="bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-line text-base leading-relaxed border">
            {notification.content}
          </div>
          <div className="text-sm text-gray-500 pt-2">
            Received: {new Date(notification.createdAt).toLocaleString()}
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-red-500 hover:text-red-700 text-lg transition"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  </div>
);

};

export default NotificationDetailModal;
