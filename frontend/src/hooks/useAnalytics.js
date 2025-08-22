import { useState, useCallback } from "react";
import { analyticsApi } from "../api/services/analyticsApi";

export const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  const fetchAnalytics = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsApi.getManagerAnalytics(params);
      setAnalyticsData(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch analytics data";

      setError(errorMessage);
      setAnalyticsData(null);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAnalytics = useCallback(() => {
    setAnalyticsData(null);
    setError(null);
  }, []);

  return {
    analyticsData,
    loading,
    error,
    fetchAnalytics,
    clearAnalytics,
  };
};

export default useAnalytics;
