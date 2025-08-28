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

  const fetchAdminAnalytics = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const defaultParams = {
        fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        toDate: new Date().toISOString().split("T")[0],
        fromMonth: new Date().toISOString().slice(0, 7),
        toMonth: new Date().toISOString().slice(0, 7),
        ...params,
      };

      const response = await analyticsApi.getAdminAnalytics(defaultParams);
      setAnalyticsData(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch admin analytics";

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
    fetchAdminAnalytics,
    clearAnalytics,
  };
};

export default useAnalytics;
