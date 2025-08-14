import axiosClient from '../axiosClient';

export const salonApi = {
  getSalons: (params = {}) => {
    return axiosClient.get('/salons', { params });
  },

  getSalonById: (id) => {
    return axiosClient.get(`/salons/${id}`);
  },

  createSalon: (data) => {
    return axiosClient.post('/salons', data);
  },

  updateSalon: (id, data) => {
    return axiosClient.put(`/salons/${id}`, data);
  },

  deleteSalon: (id) => {
    return axiosClient.delete(`/salons/${id}`);
  },
};