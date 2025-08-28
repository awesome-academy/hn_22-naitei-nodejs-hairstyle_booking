import React from "react";
import StylistLayout from "../../components/stylistDashboard/StylistLayout";
import CreateLeaves from "../../components/stylistDashboard/CreateLeaves";

const StylistCreateLeavePage = () => {
  return (
    <StylistLayout
      title="Create Leave Request"
      subtitle="Submit your leave request for manager approval"
    >
      <CreateLeaves />
    </StylistLayout>
  );
};

export default StylistCreateLeavePage;
