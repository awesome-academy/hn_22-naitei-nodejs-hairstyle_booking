import React from "react";
import AdminLayout from "../../components/adminDashboard/AdminLayout";
import ServiceManagement from "../../components/ServiceManagement.jsx/ServiceManagement.jsx";

const ServiceManagementPage = () => {
  return (
    <AdminLayout
      title="Service Management"
      subtitle="Manage hair salon services, pricing and service categories"
    >
      <ServiceManagement />
    </AdminLayout>
  );
};

export default ServiceManagementPage;
