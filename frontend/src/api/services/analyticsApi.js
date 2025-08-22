import axiosClient from "../axiosClient";

export const analyticsApi = {
  getManagerAnalytics: (params = {}) => {
    return axiosClient.get("/analytics", { params });
  },

  getAdminAnalytics: (params = {}) => {
    return axiosClient.get("/analytics", { params });
  },
};
