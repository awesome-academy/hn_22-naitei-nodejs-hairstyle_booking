import { useState, useCallback, useMemo } from "react";
import { useAnalytics } from "./useAnalytics";

export const useAdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    analyticsData,
    fetchAdminAnalytics,
    loading: analyticsLoading,
  } = useAnalytics();

  const stats = useMemo(() => {
    if (!analyticsData) {
      return {
        totalSalons: 0,
        totalBookings: 0,
        totalRevenue: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalServices: 0,
        cancelled: 0,
        cancelledEarly: 0,
        cancelledDayOff: 0,
      };
    }

    const { salons, services } = analyticsData;

    const totalSalons = salons.length;
    const totalBookings = salons.reduce(
      (sum, salon) => sum + salon.totalBookings,
      0
    );
    const completedBookings = salons.reduce(
      (sum, salon) => sum + salon.completed,
      0
    );
    const cancelled = salons.reduce((sum, salon) => sum + salon.cancelled, 0);
    const cancelledEarly = salons.reduce(
      (sum, salon) => sum + salon.cancelledEarly,
      0
    );
    const cancelledDayOff = salons.reduce(
      (sum, salon) => sum + salon.cancelledDayOff,
      0
    );
    const totalRevenue = salons.reduce((sum, salon) => sum + salon.revenue, 0);
    const totalServices = services.length;

    return {
      totalSalons,
      totalBookings,
      completedBookings,
      cancelled,
      cancelledEarly,
      cancelledDayOff,
      totalRevenue,
      totalServices,
    };
  }, [analyticsData]);

  const fetchDashboardData = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchAdminAnalytics(params);

        if (!result.success) {
          throw new Error(result.error);
        }
      } catch (err) {
        console.error("❌ Error fetching admin dashboard data:", err);
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    },
    [fetchAdminAnalytics]
  );

  const getTopSalons = useCallback(() => {
    if (!analyticsData?.salons) return [];

    return analyticsData.salons
      .map((salon) => ({
        ...salon,
        completionRate:
          salon.totalBookings > 0
            ? Math.round((salon.completed / salon.totalBookings) * 100)
            : 0,
        cancellationRate:
          salon.totalBookings > 0
            ? Math.round(
                ((salon.cancelled +
                  salon.cancelledEarly +
                  salon.cancelledDayOff) /
                  salon.totalBookings) *
                  100
              )
            : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [analyticsData]);

  const getPopularServices = useCallback(() => {
    if (!analyticsData?.services) return [];

    return analyticsData.services
      .sort((a, b) => b.usedCount - a.usedCount)
      .slice(0, 10);
  }, [analyticsData]);

  return {
    stats,
    analyticsData,
    loading: loading || analyticsLoading,
    error,
    fetchDashboardData,
    getTopSalons,
    getPopularServices,
  };
};

export default useAdminDashboard;
