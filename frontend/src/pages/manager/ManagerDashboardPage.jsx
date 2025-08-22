import React from "react";
import AdminLayout from "../../components/adminDashboard/AdminLayout";
import ManagerDashboard from "../../components/managerDashboard/ManagerDashboard";

const ManagerDashboardPage = () => {
  return (
    <AdminLayout
      title="Manager Dashboard"
      subtitle="Overview of your salon operations and performance"
    >
      <ManagerDashboard />
    </AdminLayout>
  );
};

export default ManagerDashboardPage;
