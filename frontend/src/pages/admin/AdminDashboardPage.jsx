import React from "react";
import AdminLayout from "../../components/adminDashboard/AdminLayout";
import AdminDashboard from "../../components/adminDashboard/AdminDashboard";

const AdminDashboardPage = () => {
  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="System overview and performance analytics"
    >
      <AdminDashboard />
    </AdminLayout>
  );
};

export default AdminDashboardPage;
