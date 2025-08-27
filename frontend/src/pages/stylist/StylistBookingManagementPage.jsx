import React from "react";
import StylistLayout from "../../components/stylistDashboard/StylistLayout";
import BookingManagement from "../../components/stylistDashboard/BookingManagement";

const StylistBookingManagementPage = () => {
  return (
  <StylistLayout
        title="Booking Management"
        subtitle="Manage your booking schedule"
      >
        <BookingManagement />
      </StylistLayout>
  );
};

export default StylistBookingManagementPage;
