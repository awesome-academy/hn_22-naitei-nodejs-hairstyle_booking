// frontend/src/pages/manager/ManagerStylistManagementPage.jsx
import React from "react";
import AdminLayout from "../../components/adminDashboard/AdminLayout";
import UserManagement from "../../components/userManagement/UserManagement";

const ManagerStylistManagementPage = () => {
  return (
    <AdminLayout
      title="Stylist Management"
      subtitle="Manage stylists in your salon"
    >
      <UserManagement />
    </AdminLayout>
  );
};

export default ManagerStylistManagementPage;
