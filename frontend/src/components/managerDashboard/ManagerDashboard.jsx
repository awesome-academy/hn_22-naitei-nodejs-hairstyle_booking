import React, { useState, useEffect } from "react";
import ManagerStats from "./ManagerStats";
import ManagerQuickActions from "./ManagerQuickActions";
import ManagerRecentActivity from "./ManagerRecentActivity";
import ManagerWelcomeCard from "./ManagerWelcomeCard";
import LoadingSpinner from "../common/LoadingSpinner";

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalStylists: 0,
    todayBookings: 0,
    pendingDayOffs: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [salonInfo, setSalonInfo] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    // Get salon info from localStorage or API
    const salonName = localStorage.getItem("salonName") || "Your Salon";
    const salonAddress = localStorage.getItem("salonAddress") || "";

    setSalonInfo({ name: salonName, address: salonAddress });

    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with real API calls
        setTimeout(() => {
          setStats({
            totalStylists: 12,
            todayBookings: 28,
            pendingDayOffs: 3,
            monthlyRevenue: 125000000,
          });

          setActivities([
            {
              id: 1,
              type: "stylist_added",
              message: "New stylist registered: Jane Smith",
              timestamp: "2 hours ago",
              color: "blue",
            },
            {
              id: 2,
              type: "dayoff_approved",
              message: "Day off request approved for Mike Johnson",
              timestamp: "4 hours ago",
              color: "green",
            },
            {
              id: 3,
              type: "booking_created",
              message: "15 new bookings today",
              timestamp: "6 hours ago",
              color: "yellow",
            },
          ]);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <ManagerWelcomeCard salonInfo={salonInfo} />
      <ManagerStats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ManagerQuickActions />
        <ManagerRecentActivity activities={activities} />
      </div>
    </div>
  );
};

export default ManagerDashboard;
