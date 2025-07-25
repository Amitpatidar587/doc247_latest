import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { format, addDays, parseISO } from "date-fns";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import { selectedAppointment } from "../../redux/slices/app_common/AppointmentSlice";
import { useNavigation } from "@react-navigation/native";
// import Reviews from "../Reviews";
import { selectedChatUser } from "../../redux/slices/app_common/utility/chatSlice";
import CustomButton from "../forms/CustomButton.jsx";
const DEFAULT_IMAGE = require("../../assets/user.jpg");

const AppointmentCard = ({
  appointment,
  // onDelete,
  onUpdateStatus,
  loading,
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
    navigation.navigate("ProfileDetails", {
      userId:
        userRole === "doctor"
          ? appointment?.patient_id
          : appointment?.doctor_id,
    });
  };

  console.log("appointment", appointment?.patient_image);
  return (
    <>
      <View style={[styles.card, { backgroundColor: colors.background }]}>
        <View style={[styles.row]}>
          {/* <Text>{imageSource.uri}</Text> */}
          <TouchableOpacity onPress={gotoProfile}>
            <Image source={imageSource} style={styles.image} />
          </TouchableOpacity>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>
              {displayName}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={14}
                  color={colors.text}
                  style={{ marginRight: 3 }}
                />
                <Text>{fmtDate(appointment?.appointment_date)}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={14}
                  color={colors.text}
                  style={{ marginRight: 3 }}
                />
                <Text>{fmtTime(appointment?.appointment_time)}</Text>
              </View>
            </View>
            {(appointment?.patient_phone && userRole === "doctor") ||
              (appointment?.doctor_phone && userRole === "patient" && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={14}
                    color={colors.text}
                    style={{ marginRight: 3 }}
                  />
                  <Text>
                    {userRole === "doctor"
                      ? appointment?.patient_phone
                      : appointment?.doctor_phone}
                  </Text>
                </View>
              ))}
            {appointment?.visit_type && (
              <View style={{}}>
                <Text style={{ fontSize: 14, color: colors.text }}>
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
                  onPress={() => onUpdateStatus(appointment, "approved")}
                >
                  {loading?.id === appointment?.id &&
                  loading?.type === "approved" ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                      Accept
                    </Text>
                  )}
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
                  onPress={() => onUpdateStatus(appointment, "rejected")}
                >
                  {loading?.id === appointment?.id &&
                  loading?.type === "rejected" ? (
                    <ActivityIndicator size="small" color="red" />
                  ) : (
                    <Text style={{ color: "red", fontWeight: "bold" }}>
                      Reject
                    </Text>
                  )}
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
                  onPress={() => onUpdateStatus(appointment, "cancelled")}
                >
                  {loading?.id === appointment?.id &&
                  loading?.type === "cancelled" ? (
                    <ActivityIndicator size="small" color="red" />
                  ) : (
                    <Text style={{ color: "red", fontWeight: "bold" }}>
                      Cancel
                    </Text>
                  )}
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
              <CustomButton
                onPress={handleSessionStart}
                title={"Start Session"}
                size="sm"
              />
            )}

            <CustomButton
              onPress={handleChatStart}
              size="sm"
              title={"Start Chat"}
            ></CustomButton>
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
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  reject: {
    padding: 8,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
  },
  cancel: {
    padding: 8,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  delete: {
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
