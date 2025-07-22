import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  acceptCall,
  busyCall,
  endCall,
  failCall,
  missedCall,
  receiveCall,
  rejectCall,
} from "../../redux/slices/app_common/utility/videoCallSlice.js";
import { socket } from "./socket.js";

const useVideoCallListener = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleNotification = (data) => {
      if (!data?.type) return;

      console.log("Received socket notification:", data);
      const { type, data: payload, reason } = data;

      switch (type) {
        case "video_call": {
          const isIncomingCall = parseInt(payload?.to_user_id) === userId;
          if (isIncomingCall) {
            dispatch(receiveCall(data?.data));
            console.log("Receiving call:", data?.data);
          }
          break;
        }

        case "call_accepted":
          dispatch(acceptCall(data));
          break;

        case "call_rejected":
          dispatch(rejectCall(reason || "Call was rejected"));
          break;

        case "missed_call":
          dispatch(missedCall("User did not answer in time"));
          break;

        case "call_failed":
          dispatch(failCall(reason || "Call failed"));
          break;

        case "call_ended":
          dispatch(endCall(reason || "Call ended"));
          break;

        case "busy":
          dispatch(busyCall(reason || "User is currently in another call"));
          break;

        default:
          console.warn("Unhandled socket notification:", data);
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [dispatch, userId]);
};

export default useVideoCallListener;
