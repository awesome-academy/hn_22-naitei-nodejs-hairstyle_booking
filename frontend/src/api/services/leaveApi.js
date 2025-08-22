import axiosClient from "../axiosClient";

export const leaveApi = {
  getManagerDayOffs: (params = {}) => {
    return axiosClient.get("/leaves", { params });
  },

  getDayOffs: async (params = {}) => {
    return axiosClient.get("/leaves", { params });
  },

  updateDayOffStatus: (id, status) => {
    return axiosClient.patch(`/leaves/${id}/status`, {
      status,
    });
  },

  createDayOff: (data) => {
    return axiosClient.post("/leaves", data);
  },
};

export default leaveApi;
