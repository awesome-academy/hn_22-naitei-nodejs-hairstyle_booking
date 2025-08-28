import React, { useEffect, useState } from "react";
import AdminStats from "./AdminStats";
import AdminAnalytics from "./AdminAnalytics";
import AdminQuickActions from "./AdminQuickActions";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

const AdminDashboard = () => {
  const {
    stats,
    analyticsData,
    loading,
    error,
    fetchDashboardData,
    getTopSalons,
    getPopularServices,
  } = useAdminDashboard();

  const [dateRange, setDateRange] = useState({
    fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchDashboardData(dateRange);
  }, [fetchDashboardData, dateRange]);

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const topSalons = getTopSalons();
  const popularServices = getPopularServices();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Dashboard Overview
          </h2>
          <div className="flex items-center gap-3 ml-auto">
            <label className="text-sm text-gray-600">From:</label>
            <input
              type="date"
              value={dateRange.fromDate}
              onChange={(e) =>
                handleDateRangeChange({
                  ...dateRange,
                  fromDate: e.target.value,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="date"
              value={dateRange.toDate}
              onChange={(e) =>
                handleDateRangeChange({
                  ...dateRange,
                  toDate: e.target.value,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <AdminStats stats={stats} />

      <AdminAnalytics
        analyticsData={analyticsData}
        topSalons={topSalons}
        popularServices={popularServices}
      />

      <AdminQuickActions />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Dashboard
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={() => fetchDashboardData(dateRange)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
