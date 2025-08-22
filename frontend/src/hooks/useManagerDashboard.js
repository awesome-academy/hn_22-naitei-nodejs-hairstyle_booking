import { useState, useCallback, useMemo } from "react";
import { useAnalytics } from "./useAnalytics";

export const useManagerDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    analyticsData,
    fetchAnalytics,
    loading: analyticsLoading,
  } = useAnalytics();

  const stats = useMemo(() => {
    if (!analyticsData) {
      return {
        totalStylists: 0,
        totalBookings: 0,
        monthlyRevenue: 0,
        completedBookings: 0,
      };
    }

    const { stylists } = analyticsData;

    const totalStylists = stylists.length;
    const totalBookings = stylists.reduce(
      (sum, stylist) => sum + stylist.totalBookings,
      0
    );
    const completedBookings = stylists.reduce(
      (sum, stylist) => sum + stylist.completed,
      0
    );
    const totalRevenue = stylists.reduce(
      (sum, stylist) => sum + stylist.revenue,
      0
    );

    return {
      totalStylists,
      totalBookings,
      completedBookings,
      monthlyRevenue: totalRevenue,
    };
  }, [analyticsData]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📊 Fetching manager dashboard data...");

      const analyticsParams = {
        fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        toDate: new Date().toISOString().split("T")[0],
      };

      const result = await fetchAnalytics(analyticsParams);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log("✅ Dashboard data fetched successfully");
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, [fetchAnalytics]);

  const getStylistPerformance = useCallback(() => {
    if (!analyticsData?.stylists) return [];

    return analyticsData.stylists
      .map((stylist) => ({
        ...stylist,
        completionRate:
          stylist.totalBookings > 0
            ? Math.round((stylist.completed / stylist.totalBookings) * 100)
            : 0,
        avgRevenuePerBooking:
          stylist.completed > 0
            ? Math.round(stylist.revenue / stylist.completed)
            : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [analyticsData]);

  const getServiceStats = useCallback(() => {
    if (!analyticsData?.services) return [];

    return analyticsData.services.sort((a, b) => b.usedCount - a.usedCount);
  }, [analyticsData]);

  return {
    stats,
    analyticsData,
    loading: loading || analyticsLoading,
    error,
    fetchDashboardData,
    getStylistPerformance,
    getServiceStats,
  };
};

export default useManagerDashboard;
