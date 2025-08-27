import React from "react";
import StylistLayout from "../../components/stylistDashboard/StylistLayout";
import StylistSideBar from "../../components/stylistDashboard/StylistSidebar";
import Leaves from "../../components/stylistDashboard/Leaves";

const StylistLeaveManagementPage = () => {
  return (
    <StylistLayout
      title="Leave Management"
      subtitle="Xem lịch sử nghỉ phép và thao tác hủy yêu cầu khi cần"
      sidebar={<StylistSideBar />}
    >
      <Leaves />
    </StylistLayout>
  );
};

export default StylistLeaveManagementPage;
