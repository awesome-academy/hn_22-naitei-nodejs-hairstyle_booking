import axiosClient from "../axiosClient";

export const authApi = {
  registerCustomer: (data) => {
    return axiosClient.post("/auth/register", data);
  },

  login: (credentials) => {
    return axiosClient.post("/auth/login", credentials);
  },

  loginAdmin: (credentials) => {
    return axiosClient.post("/auth/login/admin", credentials);
  },

  forgotPassword: (email) => {
    return axiosClient.post("/auth/forgot-password", { email });
  },

  verifyOtp: (data) => {
    return axiosClient.post("/auth/verify-reset-otp", data);
  },

  resetPassword: (data) => {
    return axiosClient.post("/auth/reset-password", data);
  },
  logout: () => {
    return axiosClient.post("/auth/logout");
  },
};
