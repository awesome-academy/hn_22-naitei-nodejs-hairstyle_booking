import React, { useEffect, useState } from 'react';
import useNotifications from '../hooks/useNotifications';
import NotificationDetailModal from '../components/notificationButton/NotificationDetailModal';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

import NavBar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

const NotificationsPage = () => {
  const { notifications, loading, error, markAsRead, fetchNotifications } = useNotifications();
  const { isAuthenticated, user } = useAuthContext();
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [isAuthenticated, user, navigate, fetchNotifications]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    setSelectedNotificationId(notification.id);
  };

  const handleCloseModal = () => {
    setSelectedNotificationId(null);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (unreadNotifications.length > 0) {
      for (const notif of unreadNotifications) {
        await markAsRead(notif.id);
      }
      fetchNotifications();
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <NavBar />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <p>Loading notifications...</p>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <NavBar />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <p className="text-red-500">{error}</p>
      </div>
      <Footer />
    </div>
  );

  if (!isAuthenticated || user?.role !== 'CUSTOMER') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <NavBar />
        <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <p className="text-gray-200">Loading or Redirecting...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <NavBar />
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Notifications
          </h1>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Stay updated with your latest bookings, offers, and more.
          </p>
        </div>
      </section>

      <section className="flex-grow py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-end items-center mb-6">
            <h1 className="text-2xl font-bold tracking-wide text-center flex-grow">
              Recent Activities
            </h1>
            <button
            onClick={handleMarkAllAsRead}
            disabled={notifications.filter(n => !n.isRead).length === 0}
            className="ml-auto flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-full font-semibold transition duration-200 disabled:opacity-50 shadow-lg cursor-pointer"
            title="Mark all notifications as read"
            >
            Mark All Read
            </button>
          </div>
<div className="bg-white text-gray-900 rounded-lg shadow-xl overflow-y-auto max-h-[400px] mt-8">
  {notifications.length === 0 ? (
    <p className="p-5 text-center text-gray-600 mt-5 text-lg">You have no notifications.</p>
  ) : (
    <div>
      {notifications.map(notification => (
        <div
          key={notification.id}
          onClick={() => handleNotificationClick(notification)}
          className={`
            p-5 border-b border-gray-300 cursor-pointer transition-colors duration-300
            last:border-b-0
            ${notification.isRead 
              ? 'bg-gray-50 text-gray-600' 
              : 'bg-white text-gray-900 font-semibold hover:bg-gray-100'}
          `}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') handleNotificationClick(notification); }}
          aria-pressed={notification.isRead}
        >
          <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
            {!notification.isRead && (
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" aria-label="Unread notification"></span>
            )}
            {notification.title}
          </h3>
          <p className="text-sm mb-2 whitespace-pre-line">{notification.content}</p>
          <span className="text-xs text-gray-500">
            {new Date(notification.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )}
</div>

        </div>
      </section>

      <Footer />

      {selectedNotificationId && (
        <NotificationDetailModal
          notificationId={selectedNotificationId}
          onClose={handleCloseModal}
          onMarkAsRead={markAsRead}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
