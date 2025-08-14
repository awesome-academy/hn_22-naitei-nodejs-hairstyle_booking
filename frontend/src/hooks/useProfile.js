import { useState, useCallback, useEffect } from "react";
import { profileApi } from "../api/services/profileApi";

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await profileApi.getMyProfile();
      console.log("Profile API response:", response.data);

      setProfile(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setError(null);
      const response = await profileApi.updateProfile(profileData);
      setProfile(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const changePassword = useCallback(async (passwordData) => {
    try {
      setError(null);
      await profileApi.changePassword(passwordData);
      return { success: true, message: "Password changed successfully" };
    } catch (err) {
      console.error("Error changing password:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to change password";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    changePassword,
    refetch: fetchProfile,
  };
};
