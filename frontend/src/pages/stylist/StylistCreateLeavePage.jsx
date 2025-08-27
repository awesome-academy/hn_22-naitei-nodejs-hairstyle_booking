import React from "react";
import StylistLayout from "../../components/stylistDashboard/StylistLayout";
import CreateLeaves from "../../components/stylistDashboard/CreateLeaves";

const StylistCreateLeavePage = () => {
  return (
    <StylistLayout
      title="Tạo yêu cầu nghỉ phép"
      subtitle="Gửi yêu cầu nghỉ cho quản lý phê duyệt"
    >
      <CreateLeaves />
    </StylistLayout>
  );
};

export default StylistCreateLeavePage;
