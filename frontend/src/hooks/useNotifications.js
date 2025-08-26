import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../api/services/notificationApi';
import { useAuthContext } from '../contexts/AuthContext';

const useNotifications = (initialPage = 1, initialLimit = 10) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalItems: 0,
    limit: initialLimit,
  });
  const { isAuthenticated, user } = useAuthContext();

  const fetchNotifications = useCallback(async (params = {}) => {
    if (!isAuthenticated || user?.role !== 'CUSTOMER') {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const defaultParams = { page: pagination.currentPage, limit: pagination.limit, onlyUnread: false, ...params };
      const data = await notificationApi.getAllUserNotifications("");
      setNotifications(data.data);
    } catch (err) {
      console.error("Error fetching notifications:", err, err?.response?.data);
      if (err?.response?.status === 403) {
          setError("Bạn không có quyền xem thông báo này.");
      } else {
          setError("Không thể tải thông báo. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, pagination.currentPage, pagination.limit]);

  const markAsRead = useCallback(async (id) => {
    if (!isAuthenticated || user?.role !== 'CUSTOMER') {
        setError("Bạn phải đăng nhập với vai trò Customer để đánh dấu thông báo đã đọc.");
        return null;
    }
    try {
      const updatedNotif = await notificationApi.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      return updatedNotif;
    } catch (err) {
      console.error("Error marking notification as read:", err, err?.response?.data);
      if (err?.response?.status === 403) {
          setError("Bạn không có quyền đánh dấu thông báo này là đã đọc.");
      } else {
          setError("Không thể đánh dấu thông báo đã đọc.");
      }
      return null;
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, loading, error, markAsRead, fetchNotifications, pagination };
};

export default useNotifications;