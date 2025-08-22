import axiosClient from '../axiosClient';

export const bookingApi = {
  getBookings: (params = {}) => {
      return axiosClient.get('/bookings', { params });
  },

  getBookingById: (id) => {
      return axiosClient.get(`/bookings/${id}`);
  },

  updateBookingStatus: (id, status) => {
      return axiosClient.patch(`/bookings/${id}/status`, { status });
  },
};

export default bookingApi;