import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PatientDashboard = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome, [Patient Name]</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("DoctorSearch")}
          >
            <Icon name="magnify" size={30} color={colors.primary} />
            <Text style={styles.actionText}>Search Doctors</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("BookAppointment")}
          >
            <Icon name="calendar-plus" size={30} color={colors.primary} />
            <Text style={styles.actionText}>Book Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("AppointmentList")}
          >
            <Icon name="calendar-check" size={30} color={colors.primary} />
            <Text style={styles.actionText}>My Appointments</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Records</Text>
        <TouchableOpacity
          style={styles.recordItem}
          onPress={() => navigation.navigate("PatientMedicalRecord")}
        >
          <Icon name="file-document" size={30} color={colors.primary} />
          <Text style={styles.recordText}>Medical Records</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recordItem}
          onPress={() => navigation.navigate("PatientVitals")}
        >
          <Icon name="heart-pulse" size={30} color={colors.primary} />
          <Text style={styles.recordText}>Vitals</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    backgroundColor: "#0474ed",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionItem: {
    alignItems: "center",
    width: "30%",
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  recordText: {
    marginLeft: 16,
    fontSize: 16,
  },
});

export default PatientDashboard;
