import { use, useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Divider, Text, Surface } from "react-native-paper";
import CustomForm from "../../../components/forms/CustomForm";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../../components/forms/CustomButton";
import {
  fetchPatientDetails,
  resetPatient,
  UpdatePatientDetails,
} from "../../../redux/slices/patient/patientSlice";
import ProfileCard from "../../../components/ProfileCard";
import { logOut } from "../../../redux/slices/app_common/auth/authSlice";
import { clearTokens } from "../../../redux/slices/app_common/auth/authService";
import { useToast } from "../../../components/utility/Toast";

const PatientBasicDetails = () => {
  const { userId } = useSelector((state) => state.auth);
  const { patient, loading, error, success, message } = useSelector(
    (state) => state.patient
  );

  console.log(" userId", userId);
  const { theme } = useSelector((state) => state.theme);
  const colors = theme.colors;
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    country_code: "+1",
    address: "",
    city: "",
    state: "",
    country: "",
    gender: "",
    date_of_birth: "",
    postal_code: "",
    blood_group: "",
    health_id: "",
    insurance_status: "",
  });

  useEffect(() => {
    if (patient) {
      setUserDetails({
        first_name: patient?.first_name || "",
        last_name: patient?.last_name || "",
        contact: patient?.contact || "",
        country_code: patient?.country_code || "+1",
        address: patient?.address || "",
        city: patient?.city || "",
        state: patient?.state || "",
        country: patient?.country || "",
        postal_code: patient?.postal_code || "",
        blood_group: patient?.blood_group || "",
        gender: patient?.gender || "",
        email: patient?.email || "",
        health_id: patient?.health_id || "",
        insurance_status: patient?.insurance_status || "",
        date_of_birth: patient?.date_of_birth || "",
      });
    }
  }, [patient]);

  const fields = useMemo(
    () => [
      {
        name: "first_name",
        label: "First Name",
        type: "text",
        value: userDetails?.first_name,
      },
      {
        name: "last_name",
        label: "Last Name",
        type: "text",
        value: userDetails?.last_name,
      },

      {
        name: "email",
        label: "Email",
        type: "text",
        value: userDetails?.email,
        disabled: true,
      },
      {
        name: "date_of_birth",
        label: "Date of Birth",
        type: "date",
        value: userDetails?.date_of_birth,
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "phone",
        value: {
          country_code: userDetails?.country_code || "+1",
          contact: userDetails?.contact || "",
        },
      },
      {
        name: "postal_code",
        label: "Postal Code",
        type: "postal_lookup",
        value: {
          country: userDetails?.country,
          postalCode: userDetails?.postal_code,
        },
      },
      {
        name: "address",
        label: "Address",
        type: "text",
        value: userDetails?.address,
      },
      { name: "city", label: "City", type: "text", value: userDetails?.city },
      {
        name: "state",
        label: "State",
        type: "text",
        value: userDetails?.state,
      },

      {
        name: "gender",
        label: "Gender",
        type: "select",
        value: userDetails?.gender,
        options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Other", value: "other" },
        ],
      },
      {
        name: "blood_group",
        label: "Blood Group",
        type: "select",
        value: userDetails?.blood_group,
        options: [
          { label: "A+", value: "A+" },
          { label: "A-", value: "A-" },
          { label: "B+", value: "B+" },
          { label: "B-", value: "B-" },
          { label: "AB+", value: "AB+" },
          { label: "AB-", value: "AB-" },
          { label: "O+", value: "O+" },
          { label: "O-", value: "O-" },
        ],
      },
      {
        name: "insurance_status",
        label: "Insurance Status",
        type: "select",
        value: userDetails?.insurance_status,
        options: [
          { label: "Insured", value: true },
          { label: "Uninsured", value: false },
        ],
      },

      {
        name: "health_id",
        label: "Health ID",
        type: "number",
        value: userDetails?.health_id,
      },
    ],
    [userDetails]
  );

  const fetchpatient = useCallback(async () => {
    try {
      dispatch(fetchPatientDetails({ id: userId }));
    } catch (error) {
      console.error("Error fetching patient:", error);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    fetchpatient();
  }, [fetchpatient]);

  useEffect(() => {
    if (message === null) return;
    showToast(message, success ? "success" : "error");
    dispatch(resetPatient());
    if (success) {
      setModalVisible(false);
      fetchpatient();
    }
  }, [success, error, message, dispatch]);

  const setFieldValue = useCallback((field, value) => {
    // Handle phone field split into contact + country_code
    if (field === "phoneNumber") {
      setUserDetails((prev) => ({
        ...prev,
        country_code: value?.country_code,
        contact: value?.contact,
      }));
    } else {
      setUserDetails((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  }, []);

  const handleSave = async () => {
    try {
      dispatch(UpdatePatientDetails({ id: userId, patientData: userDetails }));
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  // console.log(userDetails);

  const onLogout = async () => {
    console.log("Logging out...");
    await clearTokens();
    dispatch(logOut());
  };

  return (
    <Surface style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: colors.text }]}>
          <ProfileCard userData={patient} onLogOut={onLogout} />
        </Text>
      </View>

      <Divider style={[styles.divider, { backgroundColor: "#f5f5f5" }]} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.detailsContainer}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            paddingHorizontal: 10,
          }}
        >
          <View style={{ padding: 0 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Patient Information
            </Text>

            {[
              { label: "Address", value: patient?.address || "N/A" },
              { label: "City", value: patient?.city || "N/A" },
              { label: "State", value: patient?.state || "N/A" },
              { label: "Country", value: patient?.country || "N/A" },
              { label: "Postal Code", value: patient?.postal_code || "N/A" },
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "#444" }}
                >
                  {item.label}:
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#222",
                    textTransform: "capitalize",
                    flexShrink: 1,
                    textAlign: "right",
                  }}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          <View>
            {/* <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Other Details
            </Text> */}
            {/* <Text style={{ textTransform: "capitalize", fontSize: 16 }}>
              {userDetails?.speciality}
            </Text> */}
          </View>
        </View>
        <CustomButton
          title="Edit Profile"
          onPress={() => setModalVisible(true)}
          style={{ marginTop: 10 }}
        />
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Text
            style={{
              color: colors.primary,
              fontWeight: "bold",
              // fontSize: 18,
              flex: 1,
              borderWidth: 1,
              alignItems: "center",
              borderColor: "red",
              color: "red",
              justifyContent: "center",
              borderRadius: 50,
              padding: 15,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Logout  
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={modalVisible}
        style={styles.mainModal}
        animationType="slide"
        transparent
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <CustomForm
                fields={fields}
                setFieldValue={setFieldValue}
                isEditing={true}
                handleSave={handleSave}
                loading={loading}
                handleCancel={() => setModalVisible(false)}
                style={{ height: "100%" }}
                // scrollStyle={{ maxHeight: "100%" }}
                buttonStyles={{
                  saveButton: { width: 150 },
                  cancelButton: { width: 150 },
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  // headerContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: 10,
  // },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  detailsContainer: {
    paddingBottom: 40,
  },

  mainModal: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    bottom: 0,
  },
  modalContainer: {
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    // borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 20,
    elevation: 5,
    minHeight: "100%",
  },
  scrollContainer: {
    paddingBottom: 24,
  },
});

export default PatientBasicDetails;
