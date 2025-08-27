import axiosClient from "../axiosClient";

export const userApi = {
  getUsers: (params = {}) => {
    return axiosClient.get("/users", { params });
  },

  createStylist: (data) => {
    return axiosClient.post("/users/stylist", data);
  },

  createManager: (data) => {
    return axiosClient.post("/users/manager", data);
  },

  updateUserStatus: (userId, data) => {
    return axiosClient.patch(`/users/${userId}/status`, data);
  },

  getUserById: (userId) => {
    return axiosClient.get(`/users/${userId}`);
  },
};
