import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientDetails } from "../../../redux/slices/patient/patientSlice.js";
import MedicalRecords from "./MedicalRecords.jsx"; // used for Appointment tab
import PrescriptionTable from "./PrescriptionTabel.jsx";
import {
  fetchMedicalRecord,
  fetchMedicalRecords,
} from "../../../redux/slices/patient/profile/medicalRecordSlice.js";
import { getAge } from "../../../components/hooks/dateHook.js";

const formatDate = (iso) => {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
};

const PatientInfo = ({ route }) => {
  const { userId } = route.params;
  const dispatch = useDispatch();
  const { patient } = useSelector((state) => state.patient);
  const { records } = useSelector((state) => state.medical);

  useEffect(() => {
    dispatch(fetchPatientDetails({ id: userId }));
    dispatch(fetchMedicalRecords(userId));
  }, [dispatch, userId]);

  const getINitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
    return initials;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Card */}

      <View style={styles.card}>
        <View style={styles.row}>
          {patient?.profile_image ? (
            <Image
              source={{ uri: patient?.profile_image }}
              style={styles.avatar}
              alt="Avatar"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.initialsText}>
                {getINitials(
                  `${patient?.first_name || ""} ${patient?.last_name || ""}`
                )}
              </Text>
            </View>
          )}

          <View style={styles.info}>
            <Text style={styles.id}>Health ID: {patient?.health_id}</Text>
            <Text style={styles.name}>
              {patient?.first_name} {patient?.last_name}
            </Text>
            <View style={styles.metaRow}>
              <Text>Age: {getAge(patient?.date_of_birth)}</Text>
              <Text>Gender: {patient?.gender.toUpperCase()}</Text>
              <Text>Blood: {patient?.blood_group}</Text>
            </View>
            <Text style={styles.address}>Address: {patient?.address}</Text>
          </View>
        </View>
        <View style={styles.contactBlock}>
          <Text style={styles.contactLabel}>
            <Icon name="phone" size={12} /> Contact
          </Text>
          <Text style={styles.contact}>{patient?.contact}</Text>
        </View>
      </View>

      {/* Tabs */}
      {/* <View style={styles.tabs}>
        {["Mdical Records", "Vitals"].map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveTab(index)}
            style={[styles.tabButton, activeTab === index && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View> */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Medical Records</Text>
        <MedicalRecords records={records} />
      </View>

      {/* Tab Content */}
      {/* <View style={styles.content}>
        {activeTab === 0 ? (
          <MedicalRecords records={records} />
        ) : (
          <PrescriptionTable />
        )}
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f8f9fa", flex: 1 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#adb5bd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  initialsText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#ccc",
  },
  info: { flex: 1 },
  id: { color: "#0d6efd", fontSize: 12 },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  address: { fontSize: 14, marginBottom: 4 },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    marginTop: 4,
  },
  contactBlock: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  contactLabel: { color: "#6c757d", fontSize: 12, marginBottom: 2 },
  contact: { fontSize: 14 },
  tabs: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#dee2e6",
    borderRadius: 8,
  },
  activeTab: { backgroundColor: "#0d6efd" },
  tabText: { fontSize: 14, color: "#495057" },
  activeTabText: { color: "#fff" },
  content: {},

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
export default PatientInfo;
