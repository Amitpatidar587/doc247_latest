import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { socket } from "../socket/socket";
import { navigate } from "../../navigationRef";
import DummyImg from "../../assets/doctor.jpg";
import { useDispatch, useSelector } from "react-redux";

import {
  createAppointment,
  resetAppointmentState,
  resetCreateAppointment,
} from "../../redux/slices/app_common/AppointmentSlice.js";
import { ActivityIndicator, Text } from "react-native-paper";

const IncomingCallModal = ({
  incomingCall,
  callStatus,
  show,
  onAccept,
  onReject,
  onClose,
  reason,
  receiverData,
  acceptedData,
}) => {
  const timeoutRef = useRef(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.appointment);
  useEffect(() => {
    if (
      callStatus === "rejected" ||
      callStatus === "missed" ||
      callStatus === "failed" ||
      callStatus === "busy"
    ) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (callStatus === "accepted") {
      const timer = setTimeout(() => {
        onClose();
        const data = {
          ...receiverData,
          appointment_id: acceptedData?.appointment_id,
        };
        navigate("DoctorVideo", {
          state: data,
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [callStatus, incomingCall, onClose]);

  useEffect(() => {
    if (show && callStatus === "incoming") {
      timeoutRef.current = setTimeout(() => {
        onReject?.("Call timed out");
        onClose();
      }, 45000);
    }

    if (show && callStatus === "connecting") {
      timeoutRef.current = setTimeout(() => {
        onReject?.("Call timed out");
        onClose();
      }, 45000);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [show, callStatus, onClose, onReject]);

  const handleAccept = async () => {
    clearTimeout(timeoutRef.current);
    if (!incomingCall?.appointment_id) {
      let data = {
        doctor_id: incomingCall?.to_user_id,
        patient_id: incomingCall?.from_user_id,
        appointment_date: new Date().toISOString().split("T")[0],
        appointment_time: new Date().toISOString().split("T")[1].split(".")[0],
        appointment_end_time: new Date()
          .toISOString()
          .split("T")[1]
          .split(".")[0],
        visit_type: "video_call",
      };
      onAccept();
      onClose();
      const res = await dispatch(createAppointment(data)).unwrap();
      if (res?.success) {
        dispatch(resetAppointmentState());
      }
    } else {
      dispatch(resetCreateAppointment())
      onAccept();
      onClose();
    }
  };

  const handleReject = () => {
    clearTimeout(timeoutRef.current);
    socket.emit("callRejected", {
      to_user_id: incomingCall?.from_user_id || receiverData?.to_user_id,
      to_user_type: incomingCall?.from_user_type || receiverData?.to_user_type,
      from_user_id: incomingCall?.from_user_id || receiverData?.from_user_id,
      from_user_type:
        incomingCall?.to_user_type || receiverData?.from_user_type,
      reason: "Call declined",
    });
    onReject("Call declined");
    onClose();
  };

  const renderBody = () => {
    switch (callStatus) {
      case "incoming":
        return (
          <>
            <Text style={styles.subText}>
              Incoming Call from {incomingCall?.from_user_type}
              ...
            </Text>
            <Image
              source={
                incomingCall?.sender_image
                  ? { uri: incomingCall?.sender_image }
                  : DummyImg
              }
              style={styles.avatar}
            />

            <Text style={styles.nameText}>{incomingCall?.sender_name}</Text>
            <View style={styles.centered}>
              <ActivityIndicator size="small" />
              <Text style={styles.connectingText}>Connecting...</Text>
            </View>
          </>
        );
      case "connecting":
        return (
          <>
            <Text style={styles.subText}>{receiverData?.title}</Text>
            <Image
              source={
                receiverData?.receiver_image
                  ? { uri: receiverData?.receiver_image }
                  : DummyImg
              }
              style={styles.avatar}
            />

            <Text style={styles.nameText}>{receiverData?.receiver_name}</Text>
            <View style={styles.centered}>
              <ActivityIndicator size="small" />
              <Text style={styles.connectingText}>Connecting...</Text>
            </View>
          </>
        );
      case "rejected":
        return (
          <Text style={styles.subText}>The call was rejected by user</Text>
        );
      case "accepted":
        return (
          <Text style={styles.subText}>Call accepted. Redirecting...</Text>
        );
      case "missed":
        return <Text style={styles.subText}>Call missed</Text>;
      case "failed":
        return <Text style={styles.subText}>Call failed</Text>;
      case "busy":
        return <Text style={styles.subText}>User is busy</Text>;
      default:
        return null;
    }
  };

  if (!show) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{getTitle(callStatus)}</Text>
        <View style={styles.body}>{renderBody()}</View>

        {callStatus === "incoming" && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}>
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
              <Text style={styles.btnText}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  "Accept"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {callStatus === "connecting" && (
          <TouchableOpacity style={styles.closeBtn} onPress={handleReject}>
            <Text style={styles.btnText}>Close</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const getTitle = (status) => {
  switch (status) {
    case "incoming":
      return "Incoming Call";
    case "connecting":
      return "Calling...";
    case "rejected":
      return "Call Rejected";
    case "accepted":
      return "Call Accepted";
    default:
      return "Call";
  }
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  body: {
    alignItems: "center",
  },
  subText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  connectingText: {
    marginTop: 5,
    fontSize: 14,
    color: "#444",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    textTransform: "capitalize",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ccc",
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 10,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginLeft: 5,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 8,
    marginRight: 5,
  },
  closeBtn: {
    backgroundColor: "#888",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    width: "100%",
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  centered: {
    alignItems: "center",
    marginTop: 10,
  },
});

IncomingCallModal.propTypes = {
  incomingCall: PropTypes.object,
  callStatus: PropTypes.string,
  show: PropTypes.bool.isRequired,
  userRole: PropTypes.string.isRequired,
  isCaller: PropTypes.bool.isRequired,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  onClose: PropTypes.func,
  profile: PropTypes.object,
};

export default IncomingCallModal;
