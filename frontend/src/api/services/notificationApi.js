import axiosClient from "../axiosClient";

export const notificationApi = {
  getAllForStylist: () =>
    axiosClient.get("/notifications"),

  markAsRead: (id) => axiosClient.patch(`/notifications/${id}/read`),

  getById: (id) => axiosClient.get(`/notifications/${id}`),
};
