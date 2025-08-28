import { useState, useCallback } from "react";
import { authApi } from "../api/services/authApi";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const extractUserData = useCallback((authResponse) => {
    const { access_token } = authResponse;
    let userData = null;

    if (authResponse.customer) {
      userData = authResponse.customer;
    } else if (authResponse.stylist) {
      userData = authResponse.stylist;
    } else if (authResponse.manager) {
      userData = authResponse.manager;
    } else if (authResponse.admin) {
      userData = authResponse.admin;
    }

    if (userData && access_token) {
      return { user: userData, token: access_token };
    }

    throw new Error("Invalid authentication response");
  }, []);

  const storeAuthData = useCallback((user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("userRole", user.role?.name || user.role);
    localStorage.setItem("userFullName", user.fullName);
    localStorage.setItem("userEmail", user.email);
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userEmail");
  }, []);

  const getNavigationPath = useCallback((userRole) => {
    switch (userRole?.toUpperCase()) {
      case "ADMIN":
        return "/admin/dashboard";
      case "MANAGER":
        return "/manager/dashboard";
      case "STYLIST":
        return "/stylist-dashboard";
      case "CUSTOMER":
        return "/profile";
      default:
        return "/";
    }
  }, []);

  const login = useCallback(
    async (credentials) => {
      try {
        setLoading(true);
        const response = await authApi.login(credentials);
        const { user, token } = extractUserData(response.data);

        storeAuthData(user, token);

        return {
          success: true,
          user,
          token,
          navigationPath: getNavigationPath(user.role?.name || user.role),
        };
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again.";
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [extractUserData, storeAuthData, getNavigationPath]
  );

  const loginAdmin = useCallback(
    async (credentials) => {
      try {
        setLoading(true);
        const response = await authApi.loginAdmin(credentials);
        const { user, token } = extractUserData(response.data);

        storeAuthData(user, token);

        return {
          success: true,
          user,
          token,
          navigationPath: getNavigationPath(user.role?.name || user.role),
        };
      } catch (error) {
        console.error("Admin login error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Admin login failed. Please try again.";
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [extractUserData, storeAuthData, getNavigationPath]
  );

  const register = useCallback(
    async (userData) => {
      try {
        setLoading(true);
        const response = await authApi.registerCustomer(userData);
        const { user, token } = extractUserData(response.data);

        storeAuthData(user, token);

        return {
          success: true,
          user,
          token,
          navigationPath: getNavigationPath(user.role?.name || user.role),
        };
      } catch (error) {
        console.error("Registration error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again.";
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [extractUserData, storeAuthData, getNavigationPath]
  );

  const logout = useCallback(() => {
    clearAuthData();
    authApi.logout().catch(console.error);
  }, [clearAuthData]);

  const forgotPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      await authApi.forgotPassword(email);
      return { success: true, message: "OTP code has been sent to your email" };
    } catch (error) {
      console.error("Forgot password error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset email. Please try again.";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (otpData) => {
    try {
      setLoading(true);
      const response = await authApi.verifyOtp(otpData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("OTP verification error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "OTP verification failed. Please try again.";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (resetData) => {
    try {
      setLoading(true);
      await authApi.resetPassword(resetData);
      return { success: true, message: "Password reset successfully" };
    } catch (error) {
      console.error("Password reset error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Password reset failed. Please try again.";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    login,
    loginAdmin,
    register,
    logout,
    forgotPassword,
    verifyOtp,
    resetPassword,
    getNavigationPath,
    clearAuthData,
  };
};
