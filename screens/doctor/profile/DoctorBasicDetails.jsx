import { useCallback, useEffect, useState } from "react";
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
  fetchDoctorById,
  reset,
  updateDoctor,
} from "../../../redux/slices/doctor/doctorSlice";
import ProfileCard from "../../../components/ProfileCard";
import { logOut } from "../../../redux/slices/app_common/auth/authSlice";
import { clearTokens } from "../../../redux/slices/app_common/auth/authService";
import { useToast } from "../../../components/utility/Toast";
import { persistor } from "../../../redux/store.js";

const DoctorBasicDetails = () => {
  const { userId } = useSelector((state) => state.auth);
  const { doctor, loading, error, success, message } = useSelector(
    (state) => state.doctor
  );
  const { showToast } = useToast();
  const { theme } = useSelector((state) => state.theme);
  const colors = theme.colors;
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    consultation_fee: "",
    designation: "",
    contact: "",
    country_code: "",
    address: "",
    city: "",
    state: "",
    country: "",
    gender: "",
    date_of_birth: "",
    postal_code: "",
    specialties: "",
    languages_spoken: "",

  });

  useEffect(() => {
    if (doctor) {
      setUserDetails({
        first_name: doctor.first_name || "",
        last_name: doctor.last_name || "",
        email: doctor.email || "",
        designation: doctor.designation || "",
        contact: doctor.contact || "",
        country_code: doctor.country_code || "",
        address: doctor.address || "",
        city: doctor.city || "",
        state: doctor.state || "",
        country: doctor.country || "",
        gender: doctor.gender || "",
        date_of_birth: doctor.date_of_birth || "",
        postal_code: doctor.postal_code || "",
        specialties: doctor.specialties || "",
        languages_spoken: doctor.languages_spoken || "",
      });
    }
  }, [doctor]);

  const fields = [
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
      editable: false,
    },

    {
      name: "date_of_birth",
      label: "Date of Birth",
      type: "date",
      value: userDetails?.date_of_birth,
      disableFutureDates: true,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "phone",
      value: {
        country_code: userDetails.country_code || "+1",
        contact: userDetails?.contact || "",
      },
    },

    {
      name: "gender",
      label: "Gender",
      type: "select",
      value: userDetails?.gender,
      options: [
        {
          label: "Male",
          value: "male",
        },
        { value: "female", label: "Female" },
        { value: "other", label: "other" },
      ],
    },
    {
      name: "consultation_fee",
      label: "Consultation Fee",
      type: "number",
      value: userDetails?.consultation_fee,
    },

    {
      name: "designation",
      label: "Speciality",
      type: "tag",
      value: userDetails?.designation,
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

    {
      name: "city",
      label: "City",
      type: "text",
      value: userDetails?.city,
    },
    {
      name: "state",
      label: "State",
      type: "text",
      value: userDetails?.state,
    },
    {
      name: "country",
      label: "Country",
      type: "text",
      value: userDetails?.country,
    },

    // {
    //   name: "specialties",
    //   label: "Specialties",
    //   type: "text",
    //   value: userDetails?.specialties,
    // },
    {
      name: "languages_spoken",
      label: "Languages Spoken",
      type: "tag",
      value: userDetails?.languages_spoken,
    },
  ];

  const fetchdoctor = useCallback(async () => {
    try {
      dispatch(reset());
      dispatch(fetchDoctorById(userId));
    } catch (error) {
      console.error("Error fetching doctor:", error);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    dispatch(reset());
    fetchdoctor();
  }, [userId, fetchdoctor]);

  useEffect(() => {
    if (message === null) return;
    showToast(message, success ? "success" : "error");
    if (success) {
      fetchdoctor();
    }
    dispatch(reset());
  }, [success, error, message, dispatch, showToast, fetchdoctor]);

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
      dispatch(updateDoctor({ id: userId, doctorData: userDetails }));
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  const onLogout = async () => {
    await clearTokens();
    dispatch(logOut());
    persistor.purge();
  };

  return (
    <Surface style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <ProfileCard userData={doctor} />
      </View>

      <Divider
        style={[styles.divider, { backgroundColor: colors.primary + "40" }]}
      />

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
          <View style={{ padding: 10 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Address
            </Text>

            {[
              { label: "Address", value: doctor?.address || "N/A" },
              { label: "City", value: doctor?.city || "N/A" },
              { label: "State", value: doctor?.state || "N/A" },
              { label: "Country", value: doctor?.country || "N/A" },
              { label: "Postal Code", value: doctor?.postal_code || "N/A" },
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
              // color: colors.primary,
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
                style={{ minheight: "100%" }}
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
    padding: 10,
    paddingBottom: 60,
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
    marginBottom: 16,
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
    // paddingHorizontal: 10,
    // paddingTop: 20,
    // elevation: 5,
    minHeight: "100%",
  },
  scrollContainer: {
    paddingBottom: 24,
  },
});

export default DoctorBasicDetails;
