import React, { useEffect } from "react";
import ManagerQuickActions from "./ManagerQuickActions";
import ManagerWelcomeCard from "./ManagerWelcomeCard";
import ManagerStats from "./ManagerStats";
import LoadingSpinner from "../common/LoadingSpinner";
import { useManagerDashboard } from "../../hooks/useManagerDashboard";

const ManagerDashboard = () => {
  const { stats, analyticsData, loading, error, fetchDashboardData } =
    useManagerDashboard();

  const [salonInfo, setSalonInfo] = React.useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    const salonName = localStorage.getItem("salonName") || "Your Salon";
    const salonAddress = localStorage.getItem("salonAddress") || "";
    setSalonInfo({ name: salonName, address: salonAddress });
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <ManagerWelcomeCard salonInfo={salonInfo} />
      <ManagerStats stats={stats} analyticsData={analyticsData} />

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
                onClick={fetchDashboardData}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <ManagerQuickActions />
      </div>
    </div>
  );
};

export default ManagerDashboard;
