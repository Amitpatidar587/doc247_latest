import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const DoctorDashboard = ({ navigation }) => {
  const { colors } = useTheme();

  // Mock data for upcoming appointments
  const appointments = [
    {
      id: 1,
      patientName: "John Doe",
      time: "10:00 AM",
      date: "April 12, 2023",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      time: "11:30 AM",
      date: "April 12, 2023",
    },
    {
      id: 3,
      patientName: "Emily Johnson",
      time: "02:00 PM",
      date: "April 12, 2023",
    },
  ];

  // Mock data for patient statistics
  const patientStats = {
    totalPatients: 978,
    patientsToday: 80,
    appointmentsToday: 50,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome, Dr. Amit Gupta</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{patientStats.totalPatients}</Text>
          <Text style={styles.statLabel}>Total Patients</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{patientStats.patientsToday}</Text>
          <Text style={styles.statLabel}>Patients Today</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {patientStats.appointmentsToday}
          </Text>
          <Text style={styles.statLabel}>Appointments Today</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentItem}>
            <Text style={styles.appointmentText}>
              {appointment.patientName}
            </Text>
            <Text style={styles.appointmentDetails}>
              {appointment.date} at {appointment.time}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("DoctorProfile")}
          >
            <Icon name="account" size={30} color={colors.primary} />
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("Messages")}
          >
            <Icon name="message" size={30} color={colors.primary} />
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("Settings")}
          >
            <Icon name="cog" size={30} color={colors.primary} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 16,
    backgroundColor: "#007bff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
    elevation: 2,
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343a40",
  },
  statLabel: {
    fontSize: 14,
    color: "#6c757d",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#343a40",
  },
  appointmentItem: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  },
  appointmentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343a40",
  },
  appointmentDetails: {
    fontSize: 14,
    color: "#6c757d",
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
});

export default DoctorDashboard;
