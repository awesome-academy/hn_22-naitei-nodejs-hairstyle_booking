// frontend/src/pages/manager/ManagerBookingManagementPage.jsx
import React from "react";
import AdminLayout from "../../components/adminDashboard/AdminLayout";
import ManagerBookingManagement from "../../components/managerBooking/ManagerBookingManagement";

const ManagerBookingManagementPage = () => {
  return (
    <AdminLayout
      title="Booking Management"
      subtitle="Monitor and manage customer bookings in your salon"
    >
      <ManagerBookingManagement />
    </AdminLayout>
  );
};

export default ManagerBookingManagementPage;
