// src/hooks/useSocketRoomJoin.js
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

const useSocketJoin = () => {
  const { userRole, userId } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userRole && userId) {
      socket.connect();
      const roomId = `${userRole}_${userId}`;
      socket.emit("joinRoom", { roomId });
      console.log(`Joined socket room: ${roomId}`);
    }
  }, [userRole, userId]);
};

export default useSocketJoin;
