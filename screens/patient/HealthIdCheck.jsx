import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { UpdatePatientDetails } from "../../redux/slices/patient/patientSlice";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { initiateCall } from "../../redux/slices/app_common/utility/videoCallSlice";
import { socket } from "../../components/socket/socket";
import { useToast } from "../../components/utility/Toast";
import CustomButton from "../../components/forms/CustomButton.jsx";
const HealthIdCheck = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { colors } = useTheme();
  const { showToast } = useToast();
  const { healthId, userId, userRole, user } = useSelector(
    (state) => state.auth
  );
  const { selectedDoctor } = useSelector((state) => state.doctor);
  const { loading } = useSelector((state) => state.appointment);
  const [isEditing, setIsEditing] = useState(!healthId);
  const [tempId, setTempId] = useState(healthId ? String(healthId) : "");
  const [noHealthId, setNoHealthId] = useState(false);

  const handleSave = async () => {
    const trimmedId = (tempId || "").trim();
    try {
      const res = await dispatch(
        UpdatePatientDetails({
          id: userId,
          patientData: { healthId: trimmedId },
        })
      ).unwrap();
      if (res) {
        showToast("Health ID updated", res.success ? "success" : "error");
        setIsEditing(false);
        setNoHealthId(false);
      }
      showToast(res.message, res.success ? "success" : "error");
      setIsEditing(false);
      setNoHealthId(false);
    } catch (error) {
      console.log("Update failed:", error);
      Alert.alert("Error", "Failed to update Health ID. Please try again.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setNoHealthId(false);
  };

  const handleToggleNoHealthId = () => {
    const newValue = !noHealthId;
    setNoHealthId(newValue);
    if (!newValue && !healthId) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleVideocall = () => {
    if (!userId || !selectedDoctor?.id) return;

    const payload = {
      data: {
        type: "video_call",
        title: "Calling Doctor...",
        body: "Please wait...",
        to_user_id: selectedDoctor?.id,
        to_user_type: "doctor",
        from_user_type: userRole,
        from_user_id: userId,
        receiver_name:
          selectedDoctor?.first_name + " " + selectedDoctor?.last_name,
        receiver_image: selectedDoctor?.profile_image,
        sender_name: user?.first_name + " " + user?.last_name,
        sender_image: user?.profile_image,
      },
    };
    dispatch(initiateCall(payload));
    socket.emit("initiateVideoCall", {
      to_user_id: selectedDoctor?.id,
      to_user_type: "doctor",
      from_user_type: userRole,
      from_user_id: userId,
      receiver_name:
        selectedDoctor?.first_name + " " + selectedDoctor?.last_name,
      receiver_image: selectedDoctor?.profile_image,
      sender_name: user?.first_name + " " + user?.last_name,
      sender_image: user?.profile_image,
    });
  };

  const trimmedTempId = (tempId || "").trim();
  const isNextEnabled = noHealthId || !isEditing;

  return (
    <View style={styles?.container}>
      <Text style={styles?.label}>Health ID or Insurance ID</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles?.input, !isEditing && styles.disabledInput]}
          placeholder="Enter Health ID"
          placeholderTextColor="#888"
          value={tempId}
          onChangeText={setTempId}
          editable={isEditing}
        />

        {!isEditing && !!healthId && (
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleEdit}
          >
            <Text style={(styles.buttonText, { color: colors.background })}>
              Edit
            </Text>
          </TouchableOpacity>
        )}

        {isEditing && (
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: colors.primary },
              trimmedTempId?.length < 8 && styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={trimmedTempId?.length < 8}
          >
            <Text style={{ color: colors.background }}>Save</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* No Health ID Switch */}
      {!healthId && (
        <View style={styles.checkboxRow}>
          <Text style={styles.checkboxLabel}>No Health ID is available</Text>
          <Switch
            value={noHealthId}
            onValueChange={handleToggleNoHealthId}
            trackColor={{ false: "#ccc", true: colors.primary }} // ✅ better contrast
            thumbColor={noHealthId ? "#fff" : "#888"}
          />
        </View>
      )}

      {/* Conditional Messages */}
      {healthId && !isEditing && !noHealthId && (
        <Text style={styles.successMsg}>No appointment fee applicable</Text>
      )}

      {noHealthId && (
        <Text style={styles.warningMsg}>
          Appointment fee of
          <Text
            style={{ fontWeight: "bold", fontSize: 16, color: colors.primary }}
          >
            {" "}
            ₹{selectedDoctor?.consultation_fees || "N/A"}
          </Text>{" "}
          will be applicable
        </Text>
      )}

      {/* Next Button */}

      <View>
        {selectedDoctor && selectedDoctor?.video_call ? (
          <CustomButton
            onPress={handleVideocall}
            disabled={!isNextEnabled}
            title={"Video Call"}
          ></CustomButton>
        ) : (
          <CustomButton
            onPress={() => navigation.navigate("Book")}
            disabled={!isNextEnabled}
            title={"Go to booking page"}
          />
        )}
      </View>
    </View>
  );
};

export default HealthIdCheck;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 20,
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#444",
  },
  successMsg: {
    backgroundColor: "#d4edda",
    borderLeftWidth: 4,
    borderLeftColor: "#28a745",
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    fontSize: 15,
    color: "#155724",
  },
  warningMsg: {
    backgroundColor: "#fff3cd",
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
    padding: 12,
    marginBottom: 20,
    borderRadius: 6,
    fontSize: 15,
    color: "#856404",
  },
  nextButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
