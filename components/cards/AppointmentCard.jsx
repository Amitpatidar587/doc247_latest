import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { format, addDays, parseISO } from "date-fns";
// import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import { selectedAppointment } from "../../redux/slices/app_common/AppointmentSlice";
import { useNavigation } from "@react-navigation/native";
// import Reviews from "../Reviews";
import { selectedChatUser } from "../../redux/slices/app_common/utility/chatSlice";
import { navigate } from "../../navigationRef.js";
const DEFAULT_IMAGE = require("../../assets/user.jpg");

const AppointmentCard = ({
  appointment,
  // onDelete,
  onUpdateStatus,
}) => {
  const { userRole } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const navigation = useNavigation();

  // Show patient details if doctor is logged in, else show doctor details
  const displayName =
    userRole === "doctor" ? appointment.patient_name : appointment.doctor_name;

  const imageSource =
    userRole === "doctor"
      ? appointment.patient_image
        ? { uri: appointment.patient_image.replace(/^http:\/\//i, "https://") }
        : DEFAULT_IMAGE
      : appointment.doctor_image
      ? { uri: appointment.doctor_image.replace(/^http:\/\//i, "https://") }
      : DEFAULT_IMAGE;

  const statusMap = {
    pending: { label: "Pending", style: styles.pending },
    approved: { label: "Approved", style: styles.confirmed },
    rejected: { label: "Rejected", style: styles.rejected },
    completed: { label: "Completed", style: styles.completed },
    cancelled: { label: "Cancelled", style: styles.cancelled },
  };
  const { label: statusLabel, style: statusStyle } =
    statusMap[appointment.status] || statusMap.pending;

  const fmtDate = (d) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
    if (d === today) {
      return "Today";
    }
    if (d === tomorrow) {
      return "Tomorrow";
    }
    return format(parseISO(d), "MMMM d, yyyy");
  };

  const fmtTime = (t) => {
    const [h, m] = (t || "").split(":");
    if (!h || !m) {
      return "Invalid";
    }
    const date = new Date(0, 0, 0, +h, +m);
    return format(date, "hh:mm a");
  };

  const handleSessionStart = () => {
    dispatch(selectedAppointment(appointment));
    navigation.navigate("Session");
  };
  const handleChatStart = () => {
    dispatch(
      selectedChatUser({
        receiver_id:
          userRole === "doctor"
            ? appointment.patient_user_id
            : appointment.doctor_user_id,
        receiver_type: userRole === "doctor" ? "patient" : "doctor",
        receiver_name:
          userRole === "doctor"
            ? appointment.patient_name
            : appointment.doctor_name,
        receiver_image:
          userRole === "doctor"
            ? appointment.patient_image
            : appointment.doctor_image,
        sender_id:
          userRole === "doctor"
            ? appointment.doctor_user_id
            : appointment.patient_user_id,
        sender_type: userRole === "doctor" ? "doctor" : "patient",
        sender_name:
          userRole === "doctor"
            ? appointment.doctor_name
            : appointment.patient_name,
        sender_image:
          userRole === "doctor"
            ? appointment.doctor_image
            : appointment.patient_image,
      })
    );
    navigation.navigate("ChatRoom");
  };

  const gotoProfile = () => {
    console.log("gotoProfile", userRole);
    navigation.navigate("ProfileDetails", {
      userId:
        userRole === "doctor"
          ? appointment?.patient_id
          : appointment?.doctor_id,
    });
  };
  return (
    <>
      <View style={styles.card}>
        <View style={styles.row}>
          {/* <Text>{imageSource.uri}</Text> */}
          <TouchableOpacity onPress={gotoProfile}>
            <Image
              source={imageSource || DEFAULT_IMAGE}
              style={styles.image}
              onError={() => {
                // Fallback to default image if there's an error
                imageSource.uri = DEFAULT_IMAGE;
              }}
            />
          </TouchableOpacity>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>
              {displayName}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <EvilIcons name="calendar" size={14} />
                <Text>{fmtDate(appointment?.appointment_date)}</Text>
              </View>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <MaterialCommunityIcons name="clock-outline" size={14} />
                <Text>{fmtTime(appointment?.appointment_time)}</Text>
              </View>
            </View>
            {(appointment?.patient_phone && userRole === "doctor") ||
              (appointment?.doctor_phone && userRole === "patient" && (
                <>
                  <MaterialCommunityIcons name="phone-outline" size={14} />
                  <Text>
                    {userRole === "doctor"
                      ? appointment.patient_phone
                      : appointment.doctor_phone}
                  </Text>
                </>
              ))}
            {appointment?.visit_type && (
              <View style={{}}>
                <Text style={{ fontSize: 14, color: "#6c757d" }}>
                  Visit Type: {appointment.visit_type}
                </Text>
              </View>
            )}
          </View>
          <View style={[styles.statusBadge, statusStyle]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        {appointment?.status === "pending" && (
          <View style={styles.actions}>
            {userRole === "doctor" ? (
              <>
                <TouchableOpacity
                  style={[
                    styles.accept,
                    {
                      borderColor: colors.primary,
                      backgroundColor: "#fff",
                      borderRadius: 20,
                    },
                  ]}
                  onPress={() => onUpdateStatus(appointment.id, "approved")}
                >
                  {/* <MaterialCommunityIcons
                    name="check"
                    color="green"
                    size={20}
                  />{" "} */}
                  <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                    Accept
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.reject,
                    {
                      borderWidth: 1,
                      borderColor: "red",
                      backgroundColor: "#fff",
                      borderRadius: 20,
                    },
                  ]}
                  onPress={() => onUpdateStatus(appointment.id, "rejected")}
                >
                  <Text style={{ color: "red", fontWeight: "bold" }}>
                    Reject
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[
                    styles.cancel,
                    {
                      borderWidth: 1,
                      borderColor: "red",
                      backgroundColor: "#fff",
                      borderRadius: 20,
                    },
                  ]}
                  onPress={() => onUpdateStatus(appointment.id, "cancelled")}
                >
                  <Text style={{ color: "red", fontWeight: "bold" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {appointment.status === "approved" && (
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            {userRole === "doctor" && (
              <TouchableOpacity
                onPress={handleSessionStart}
                style={{
                  // backgroundColor: colors.primary,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  padding: 10,
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "40%",
                  flexDirection: "row",
                  gap: 5,
                  marginTop: 5,
                }}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  color={colors.primary}
                  size={18}
                />
                <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                  Start
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleChatStart}
              style={{
                // backgroundColor: colors.primary,
                borderWidth: 1,
                borderColor: colors.primary,
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                minWidth: "40%",
                flexDirection: "row",
                gap: 5,
                marginTop: 5,
              }}
            >
              <MaterialCommunityIcons
                name="chat-outline"
                color={colors.primary}
                size={18}
              />
              <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                Chat
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {appointment.status === "completed" && userRole === "patient" && (
          <View style={styles.actions}>
            {/* {review ? (
              <View key={review.id} style={styles.row}>
                <Text style={styles.reviewName}>{review.name}</Text>
                <StarRating rating={review.rating} />
                <Text style={styles.reviewDescription}>
                  {review.description}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <MaterialCommunityIcons
                    name="pencil"
                    color="#007AFF"
                    size={20}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteReview()}>
                  <MaterialCommunityIcons name="delete" color="red" size={20} />
                </TouchableOpacity>
              </View>
            ) : ( */}
            {/* <>
              <TouchableOpacity
                style={styles.accept}
                onPress={() => setModalVisible(true)}
              >
                <MaterialCommunityIcons
                  name="star-circle"
                  color="gold"
                  size={20}
                />
                <Text style={{ marginLeft: 5 }}>Give Review</Text>
              </TouchableOpacity>
            </> */}
            {/* )} */}

            {/* <Reviews targetId={appointment?.doctor_id} targetType={"doctor"} /> */}
          </View>
        )}
      </View>
      {
        // <Modal visible={modalVisible} animationType="slide" transparent>
        //   <View style={styles.modalBackground}>
        //     <View
        //       style={[
        //         styles.modalContainer,
        //         { backgroundColor: colors.background },
        //       ]}
        //     >
        //       <Text style={[styles.modalTitle, { color: colors.text }]}>
        //         Add Your Review
        //       </Text>
        //       <TextInput
        //         placeholder="Your Name"
        //         style={[
        //           styles.input,
        //           { borderColor: colors.primary, color: colors.text },
        //         ]}
        //         value={newReview.name}
        //         onChangeText={(text) =>
        //           setNewReview((prev) => ({ ...prev, name: text }))
        //         }
        //         placeholderTextColor={colors.text}
        //       />
        //       <Text style={[styles.label, { color: colors.text }]}>
        //         Your Rating:
        //       </Text>
        //       <StarRating
        //         rating={newReview.rating}
        //         onChange={(rating) =>
        //           setNewReview((prev) => ({ ...prev, rating }))
        //         }
        //       />
        //       <TextInput
        //         placeholder="Write your review..."
        //         style={[
        //           styles.input,
        //           styles.textArea,
        //           { borderColor: colors.primary, color: colors.text },
        //         ]}
        //         multiline
        //         value={newReview.description}
        //         onChangeText={(text) =>
        //           setNewReview((prev) => ({ ...prev, description: text }))
        //         }
        //         placeholderTextColor={colors.text}
        //       />
        //       <View style={styles.buttonContainer}>
        //         <Button
        //           mode="contained"
        //           onPress={handleSubmitReview}
        //           style={{ backgroundColor: colors.primary }}
        //         >
        //           Submit
        //         </Button>
        //         <Button
        //           mode="outlined"
        //           onPress={() => setModalVisible(false)}
        //           style={{ borderColor: colors.primary }}
        //         >
        //           Cancel
        //         </Button>
        //       </View>
        //     </View>
        //   </View>
        // </Modal>
      }
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 3,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: "#fff",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 5 },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  info: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 0,
    textTransform: "capitalize",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    position: "absolute",
    right: -3,
    top: -3,
  },
  statusText: { fontSize: 12, fontWeight: "600" },

  pending: { backgroundColor: "#FFF3CD" },
  confirmed: { backgroundColor: "#E8F5E9" },
  rejected: { backgroundColor: "#FFEBEE" },
  completed: { backgroundColor: "#E1F5FE" },
  cancelled: { backgroundColor: "#F5F5F5" },

  actions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  accept: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#E8F5E9",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  reject: {
    backgroundColor: "#FFEBEE",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
  },
  cancel: {
    backgroundColor: "#FFEBEE",

    padding: 8,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  delete: {
    backgroundColor: "#FFCDD2",
    padding: 8,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 12,
    paddingVertical: 10,
  },
});

export default AppointmentCard;
