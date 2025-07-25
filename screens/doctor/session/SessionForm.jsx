import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from "prop-types";
import AdditionalInfo from "./AdditionalInfo";
import AddDiagnosis from "./AddDiagnosis";
import AddPrescription from "./AddPrescription";
import { useDispatch, useSelector } from "react-redux";
import Vitals from "./Vitals";
import Pharmacy from "./Pharmacy";
import {
  createPrescription,
  resetAppointmentState,
  resetCreateAppointment,
} from "../../../redux/slices/app_common/AppointmentSlice";
import { useTheme, ActivityIndicator } from "react-native-paper";
import { useToast } from "../../../components/utility/Toast";
import { initiateCall } from "../../../redux/slices/app_common/utility/videoCallSlice.js";
import { socket } from "../../../components/socket/socket.js";
import CustomButton from "../../../components/forms/CustomButton.jsx";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const LOCAL_STORAGE_KEY = "appointmentFormDraft";

const SessionForm = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { selectedAppointment, loading, error, message, success } = useSelector(
    (state) => state.appointment
  );
  console.log(selectedAppointment);

  const defaultFormData = {
    patient_id: selectedAppointment?.patient_id,
    doctor_id: selectedAppointment?.doctor_id,
    appointment_id: selectedAppointment?.id,
    clinic_id: selectedAppointment?.clinic_id || 1,
    patient_contact: selectedAppointment?.patient_phone,
    country_code: selectedAppointment?.patient_country_code,
    patient_name: selectedAppointment?.patient_name,
    pharmacy_id: 1,
    vitals: {
      temperature: "",
      pulse: "",
      respiratory_rate: "",
      spo2: "",
      height: "",
      weight: "",
      waist: "",
      bsa: "",
      bmitake: "",
    },
    additionaldetail: {
      previous_medical_history: "",
      clinical_notes: "",
      laboratory_tests: "",
      complaints: "",
      advice: "",
      follow_up: "",
      follow_up_date: "",
    },
    diagnosis: [],
    prescriptions: [],
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [vitalsModalVisible, setVitalsModalVisible] = useState(false);
  const [diagnosisModalVisible, setDiagnosisModalVisible] = useState(false);
  const [prescriptionsModalVisible, setPrescriptionsModalVisible] =
    useState(false);
  const [additionalModalVisible, setAdditionalModalVisible] = useState(false);
  const [pharmacyModalVisible, setPharmacyModalVisible] = useState(false);

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
        if (draft) {
          setFormData(JSON.parse(draft));
        }
      } catch (err) {
        console.error("Failed to parse saved draft:", err);
      }
    };
    loadDraft();
  }, []);

  useEffect(() => {
    if (message === null) return;
    console.log(success);
    showToast(message, success ? "success" : "error");
    if (success) {
      AsyncStorage.removeItem(LOCAL_STORAGE_KEY);
      navigation.navigate("Dashboard");
    }
    dispatch(resetAppointmentState());
  }, [message, success, error, dispatch, navigation]);

  const saveToLocalStorage = useCallback(
    debounce(async (data) => {
      try {
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.error("Failed to save draft", err);
      }
    }, 300),
    []
  );

  const handleUpdate = (section, data) => {
    const updatedData = {
      ...formData,
      [section]: data,
    };
    setFormData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const handlePhoneChange = ({ contact, country_code }) => {
    const updatedData = {
      ...formData,
      patient_contact: contact,
      country_code: country_code,
    };
    setFormData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const validateForm = () => {
    if (
      !formData.pharmacy_id &&
      !formData.patient_id &&
      !formData.doctor_id &&
      !formData.appointment_id &&
      !formData.clinic_id
    ) {
      Alert.alert("Please select a pharmacy.");
      return false;
    }
    return true;
  };

  const isEmptyObject = (obj) =>
    !obj ||
    Object.values(obj).every(
      (val) =>
        val === "" || val === null || (Array.isArray(val) && val.length === 0)
    );

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     dispatch(createPrescription(formData));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleSendPrescription = () => {
  //   dispatch(selectedPrescription(prescription));
  //   navigate("/pharmacy/search");
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedPayload = {
      patient_id: formData?.patient_id,
      doctor_id: formData?.doctor_id,
      appointment_id: formData?.appointment_id,
      clinic_id: formData?.clinic_id,
      pharmacy_id: formData?.pharmacy_id,
      patient_name: formData?.patient_name || null,
      patient_contact: formData?.patient_contact || null,
      patient_country_code: formData?.country_code || null,
    };

    if (!isEmptyObject(formData?.vitals)) {
      cleanedPayload.vitals = formData.vitals;
    }

    if (!isEmptyObject(formData?.additionaldetail)) {
      cleanedPayload.additionaldetail = formData?.additionaldetail;
    }

    if (formData.diagnosis && formData.diagnosis.length > 0) {
      cleanedPayload.diagnosis = formData?.diagnosis;
    }

    if (formData.prescriptions && formData.prescriptions.length > 0) {
      cleanedPayload.prescriptions = formData?.prescriptions;
    }

    if (!formData.pharmacy_id) {
      cleanedPayload.pharmacy_id = 1;
    }

    try {
      dispatch(createPrescription(cleanedPayload));
    } catch (error) {
      console.log(error);
    }
  };

  const handleVideocall = () => {
    if (!selectedAppointment?.id) {
      return;
    }
    const payload = {
      data: {
        type: "video_call",
        title: "Calling Patient...",
        body: "Please wait...",
        from_user_id: selectedAppointment?.doctor_id,
        from_user_type: "doctor",
        to_user_id: selectedAppointment?.patient_id,
        to_user_type: "patient",
        appointment_id: selectedAppointment?.id,
        receiver_name: selectedAppointment?.patient_name,
        receiver_image: selectedAppointment?.patient_image,
        sender_name: selectedAppointment?.doctor_name,
        sender_image: selectedAppointment?.doctor_image,
      },
    };
    dispatch(resetCreateAppointment());
    dispatch(initiateCall(payload));
    socket.emit("initiateVideoCall", {
      from_user_id: selectedAppointment?.doctor_id,
      from_user_type: "doctor",
      to_user_id: selectedAppointment?.patient_id,
      to_user_type: "patient",
      appointment_id: selectedAppointment?.id,
      receiver_name: selectedAppointment?.patient_name,
      receiver_image: selectedAppointment?.patient_image,
      sender_name: selectedAppointment?.doctor_name,
      sender_image: selectedAppointment?.doctor_image,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Section Triggers */}

      {/* <TouchableOpacity
        style={styles.modalButton}
        onPress={() => navigation.navigate("DoctorVideo")}
      >
        <Text style={styles.modalButtonText}>Connect To Patient</Text>
      </TouchableOpacity> */}

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setVitalsModalVisible(true)}
        >
          <Text style={styles.modalButtonText}>Add Patient Vitals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setDiagnosisModalVisible(true)}
        >
          <Text style={styles.modalButtonText}>Add Diagnosis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setPrescriptionsModalVisible(true)}
        >
          <Text style={styles.modalButtonText}>Add Prescriptions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setAdditionalModalVisible(true)}
        >
          <Text style={styles.modalButtonText}>Additional Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modalButton, { width: "100%" }]}
          onPress={() => setPharmacyModalVisible(true)}
        >
          <Text style={styles.modalButtonText}>Select Pharmacy</Text>
        </TouchableOpacity>

        {selectedAppointment?.visit_type !== "offline" && (
          <TouchableOpacity
            style={[styles.modalButton, { width: "100%" }]}
            onPress={() => handleVideocall()}
          >
            <Text style={styles.modalButtonText}>Start Video Call</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modals */}
      <Modal
        visible={vitalsModalVisible}
        animationType="slide"
        onRequestClose={() => setVitalsModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Vitals
            vitals={formData.vitals}
            onChange={(data) => handleUpdate("vitals", data)}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => setVitalsModalVisible(false)}
            >
              <Text style={styles.submitButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.closeButton, { borderColor: colors.primary }]}
              onPress={() => setVitalsModalVisible(false)}
            >
              <Text style={{ color: colors.primary }}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        visible={diagnosisModalVisible}
        animationType="slide"
        onRequestClose={() => setDiagnosisModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <AddDiagnosis
            diagnosisList={formData.diagnosis}
            onChange={(data) => handleUpdate("diagnosis", data)}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={() => setDiagnosisModalVisible(false)}
            >
              <Text style={{ color: colors.background }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.closeButton, { borderColor: colors.primary }]}
              onPress={() => setDiagnosisModalVisible(false)}
            >
              <Text style={{ color: colors.primary }}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        visible={prescriptionsModalVisible}
        animationType="slide"
        onRequestClose={() => setPrescriptionsModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <AddPrescription
            prescriptionList={formData.prescriptions}
            onChange={(data) => handleUpdate("prescriptions", data)}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => setPrescriptionsModalVisible(false)}
            >
              <Text style={styles.submitButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.closeButton, { borderColor: colors.primary }]}
              onPress={() => setPrescriptionsModalVisible(false)}
            >
              <Text style={{ color: colors.primary }}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        visible={additionalModalVisible}
        animationType="slide"
        onRequestClose={() => setAdditionalModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <AdditionalInfo
            additionaldetail={formData.additionaldetail}
            onChange={(data) => handleUpdate("additionaldetail", data)}
          />
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={() => setAdditionalModalVisible(false)}
          >
            <Text style={{ color: colors.background }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.closeButton, { borderColor: colors.primary }]}
            onPress={() => setAdditionalModalVisible(false)}
          >
            <Text style={{ color: colors.primary }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={pharmacyModalVisible}
        animationType="slide"
        onRequestClose={() => setPharmacyModalVisible(false)}
      >
        {/* <ScrollView contentContainerStyle={styles.modalContainer}> */}
        <Pharmacy
          formData={formData}
          onChange={handleUpdate}
          handlePhoneChange={handlePhoneChange}
        />
        {/* </ScrollView> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => setPharmacyModalVisible(false)}
          >
            <Text style={[styles.saveButtonText, { color: colors.background }]}>
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.closeButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setPharmacyModalVisible(false)}
          >
            <Text style={{ color: colors.primary }}>close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Submit Button */}
      <CustomButton
        onPress={handleSubmit}
        loading={loading}
        title={"End Session"}
      />
    </ScrollView>
  );
};

SessionForm.propTypes = {
  patientId: PropTypes.string,
  doctorId: PropTypes.string,
  appointmentId: PropTypes.string,
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    minHeight: "100%",
    paddingBottom: 70,
  },
  modalButton: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 6,
    boxShadow: "0 0 6px 0 rgba(0, 0, 0, .2)",
    borderRadius: 10,
    elevation: 1,
    width: "48%",
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
  },
  closeButton: {
    borderRadius: 50,
    borderWidth: 1,
    minWidth: 150,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginVertical: 24,
  },
  submitButton: {
    backgroundColor: "#007bff",
    borderRadius: 50,
    minWidth: 150,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginVertical: 24,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SessionForm;
