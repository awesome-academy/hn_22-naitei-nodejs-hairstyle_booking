import React from "react";
import { useLocation } from "react-router-dom";
import StylistLayout from "../../components/stylistDashboard/StylistLayout";
import StylistSideBar from "../../components/stylistDashboard/StylistSidebar";
import Notifications from "../../components/stylistDashboard/Notifications";
import NotificationDetail from "../../components/stylistDashboard/NotificationDetail";

const StylistNotificationsPage = () => {
  const location = useLocation();
  const isDetail = location.pathname.endsWith("/detail");

  return (
    <StylistLayout
      title="Notifications"
      subtitle="Xem và đánh dấu đọc các thông báo của bạn"
      sidebar={<StylistSideBar />}
    >
      {isDetail ? <NotificationDetail /> : <Notifications />}
    </StylistLayout>
  );
};

export default StylistNotificationsPage;
