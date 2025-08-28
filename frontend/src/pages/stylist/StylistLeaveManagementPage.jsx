import React from "react";
import StylistLayout from "../../components/stylistDashboard/StylistLayout";
import StylistSideBar from "../../components/stylistDashboard/StylistSidebar";
import Leaves from "../../components/stylistDashboard/Leaves";

const StylistLeaveManagementPage = () => {
  return (
    <StylistLayout
      title="Leave Management"
      subtitle="View your leave history and cancel requests when needed"
      sidebar={<StylistSideBar />}
    >
      <Leaves />
    </StylistLayout>
  );
};

export default StylistLeaveManagementPage;
