import axiosClient from '../axiosClient';

export const notificationApi = {
  getAllUserNotifications: async (params = {}) => {
    const response = await axiosClient.get('/notifications', { params });
    return response;
  },
  getNotificationDetail: async (id) => {
    const response = await axiosClient.get(`/notifications/${id}`);
    return response;
  },
  markNotificationAsRead: async (id) => {
    const response = await axiosClient.patch(`/notifications/${id}/read`);
    return response;
  },
};