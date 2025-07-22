import { useEffect } from "react";
import socket from "../socket/socket";

const useNotifications = () => {
  useEffect(() => {
    const handleNotification = async (data) => {
      //   const { title, body, type } = data;
      console.log(data); // data;

      // Push notification if app is in background
      //   if (AppState.currentState !== "active") {
      //     await Notifications.scheduleNotificationAsync({
      //       content: { title, body },
      //       trigger: null,
      //     });
      //   }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, []);
};

export default useNotifications;
