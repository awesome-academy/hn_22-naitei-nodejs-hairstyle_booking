// frontend/src/pages/admin/SalonManagementPage.jsx
import React from "react";
import AdminLayout from "../../components/adminDashboard/AdminLayout";
import SalonManagement from "../../components/salonManagement/SalonManagement";

const SalonManagementPage = () => {
  return (
    <AdminLayout
      title="Salon Management"
      subtitle="Manage salons, locations and salon information across the system"
    >
      <SalonManagement />
    </AdminLayout>
  );
};

export default SalonManagementPage;