import React from "react";
import AdminLayout from "../../components/adminDashboard/AdminLayout";
import ManagerDayOffManagement from "../../components/managerDayOff/ManagerDayOffManagement";

const ManagerDayOffManagementPage = () => {
  return (
    <AdminLayout
      title="Day Off Management"
      subtitle="Review and manage stylist day off requests"
    >
      <ManagerDayOffManagement />
    </AdminLayout>
  );
};

export default ManagerDayOffManagementPage;
