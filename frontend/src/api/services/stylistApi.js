import axiosClient from "../axiosClient";

export const stylistApi = {
  getStylists: (params = {}) => {
    return axiosClient.get("/stylists", { params });
  },

  getStylistById: (id) => {
    return axiosClient.get(`/stylists/${id}`);
  },

  createStylist: (data) => {
    return axiosClient.post("/stylists", data);
  },

  updateStylist: (id, data) => {
    return axiosClient.put(`/stylists/${id}`, data);
  },

  deleteStylist: (id) => {
    return axiosClient.delete(`/stylists/${id}`);
  },
};
