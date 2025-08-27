import React from "react";
import { useNavigate } from "react-router-dom";
import { BellAlertIcon } from "@heroicons/react/24/solid";
import { useNotificationSocket } from "../../hooks/useNotificationSocket";

const NotificationBellSimple = ({ isAuthenticated, userRole }) => {
  const navigate = useNavigate();
  const { unreadCount } = useNotificationSocket();

  if (!isAuthenticated || userRole !== "CUSTOMER") return null;

  const handleBellClick = () => navigate("/notifications");

  return (
    <button
      onClick={handleBellClick}
      className="relative bg-white/20 hover:bg-white/30 p-2 rounded-lg transition duration-200"
    >
      <BellAlertIcon className="h-6 w-6 text-yellow-400" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBellSimple;
