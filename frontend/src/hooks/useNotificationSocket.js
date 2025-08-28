import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";

export const useNotificationSocket = () => {
  const { isAuthenticated, user } = useAuthContext();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const socket = io("http://localhost:3000", {
      query: { userId: user.id },
    });

    socket.on("connect", () => console.log("Connected to NotificationSocket"));

    socket.on("new_notification", (notif) => {
      if (notif.unreadCount !== undefined) {
        setUnreadCount(notif.unreadCount);
      } else {
        setUnreadCount((c) => c + 1);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  return { unreadCount, setUnreadCount };
};
