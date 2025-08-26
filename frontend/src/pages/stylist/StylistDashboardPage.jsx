import React from "react";
import StylistLayout from "../../components/stylistDashboard/StylistLayout";
import StylistDashboard from "../../components/stylistDashboard/StylistDashboard";

const StylistDashboardPage = () => {
  return (
    <StylistLayout>
        <div className="flex-1 p-6">
          <StylistDashboard />
        </div>
    </StylistLayout>
  );
};

export default StylistDashboardPage;
