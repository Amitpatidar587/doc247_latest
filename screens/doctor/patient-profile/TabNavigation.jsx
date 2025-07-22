import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

// Import your actual components here
import AppointmentTable from "./AppointmentTable";
import PrescriptionTable from "./PrescriptionTable";
import MedicalRecords from "./MedicalRecords";
import Billing from "./Billing";

const labels = ["Appointment", "Prescription", "Medical Records", "Billing"];

const TabNavigation = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState("");

  const appointment = [
    // Same appointment data you provided
  ];

  const prescription = [
    // Same prescription data you provided
  ];

  const renderTabContent = () => {
    switch (activeIndex) {
      case 0:
        return <AppointmentTable data={appointment} />;
      case 1:
        return <PrescriptionTable data={prescription} />;
      case 2:
        return <MedicalRecords />;
      case 3:
        return <Billing />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        {labels.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabItem,
              activeIndex === index && styles.tabItemActive,
            ]}
            onPress={() => setActiveIndex(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeIndex === index && styles.tabTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search & Action */}
      <View style={styles.actionRow}>
        <View style={styles.searchBox}>
          <Icon
            name="search"
            size={16}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add New Prescription</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={{ marginTop: 5 }}>{renderTabContent()}</View>
    </View>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  tabItemActive: {
    backgroundColor: "#0d6efd",
  },
  tabText: {
    fontSize: 13,
    color: "#6c757d",
  },
  tabTextActive: {
    color: "#fff",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    alignItems: "center",
    marginBottom: 5,
    flexWrap: "wrap",
    gap: 5,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#0d6efd",
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});
