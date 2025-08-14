import axiosClient from "../axiosClient";

export const profileApi = {
  getMyProfile: () => {
    return axiosClient.get("/profile");
  },

  updateProfile: (data) => {
    return axiosClient.put("/profile", data);
  },

  changePassword: (data) => {
    return axiosClient.patch("/profile/change-password", data);
  },
};
