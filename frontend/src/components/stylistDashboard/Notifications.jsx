import { notificationApi } from "../../api/services/notificationApi";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getAllForStylist();
      const notifications = res?.data ?? res;

      const mapped = notifications.map((n) => ({
        id: n.id,
        title: n.title,
        content: n.content,
        read: n.isRead,
        time: formatDate(n.createdAt),
      }));

      setItems(mapped);
    } catch (error) {
      console.error("Lỗi khi tải thông báo:", error);
      alert("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setItems((prev) =>
        prev.map((x) => (x.id === id ? { ...x, read: true } : x)),
      );
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
      alert("Không thể đánh dấu đã đọc.");
    }
  };

  const formatDate = (isoDate) => {
    try {
      const date = new Date(isoDate);
      return date.toLocaleString();
    } catch {
      return isoDate;
    }
  };

  const handleView = (id) => {
    sessionStorage.setItem("selectedNotificationId", id);
    navigate("/stylist-dashboard/notifications/detail");
  };

  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 2h13a2 2 0 012 2v4l-7 7H4a2 2 0 01-2-2V4a2 2 0 012-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Thông báo
              </h1>
              <p className="text-gray-500 mt-1">
                Quản lý các thông báo của bạn
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {unreadCount} chưa đọc
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {items.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng số</p>
                  <p className="text-2xl font-bold text-gray-900">{items.length}</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chưa đọc</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã đọc</p>
                  <p className="text-2xl font-bold text-gray-900">{items.length - unreadCount}</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="text-gray-600 font-medium">Đang tải thông báo...</span>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 2h13a2 2 0 012 2v4l-7 7H4a2 2 0 01-2-2V4a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có thông báo nào</h3>
              <p className="text-gray-500">Bạn chưa có thông báo nào trong hệ thống</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((n, index) => (
                <div
                  key={n.id}
                  className={`group relative p-6 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/30 transition-all duration-300 ${
                    !n.read ? 'bg-gradient-to-r from-blue-50/50 to-indigo-50/30' : ''
                  }`}
                >
                  {/* Unread indicator */}
                  {!n.read && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  )}
                  
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          !n.read 
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                            : 'bg-gray-100'
                        }`}>
                          <svg className={`w-4 h-4 ${!n.read ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 2h13a2 2 0 012 2v4l-7 7H4a2 2 0 01-2-2V4a2 2 0 012-2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-200 ${
                            !n.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {n.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-500">{n.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      {n.content && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {n.content}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        className="group/btn flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                        onClick={() => handleView(n.id)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="font-medium">Xem</span>
                      </button>
                      
                      {!n.read && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="group/mark flex items-center space-x-2 px-4 py-2 border-2 border-green-200 text-green-700 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-medium hidden sm:inline">Đánh dấu đã đọc</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Decoration */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        </div>
      </div>
    </div>
  );
}
