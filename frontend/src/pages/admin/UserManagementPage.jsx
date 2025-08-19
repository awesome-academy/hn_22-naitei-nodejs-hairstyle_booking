// frontend/src/pages/admin/UserManagementPage.jsx
import React from "react";
import AdminLayout from "../../components/adminDashboard/AdminLayout";
import UserManagement from "../../components/userManagement/userManagement";

const UserManagementPage = () => {
  return (
    <AdminLayout
      title="User Management"
      subtitle="Manage users, roles and permissions across the hair salon system"
    >
      <UserManagement />
    </AdminLayout>
  );
};

export default UserManagementPage;
