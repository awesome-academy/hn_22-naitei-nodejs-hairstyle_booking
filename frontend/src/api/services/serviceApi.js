import axiosClient from '../axiosClient';

export const serviceApi = {
  getServices: (params = {}) => {
    return axiosClient.get('/services', { params });
  },

  getServiceById: (id) => {
    return axiosClient.get(`/services/${id}`);
  },

  createService: (data) => {
    return axiosClient.post('/services', data);
  },

  updateService: (id, data) => {
    return axiosClient.put(`/services/${id}`, data);
  },

  deleteService: (id) => {
    return axiosClient.delete(`/services/${id}`);
  },
};