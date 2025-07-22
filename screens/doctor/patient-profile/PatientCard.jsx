import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import Icon from "react-native-vector-icons/SimpleLineIcons";
import { getAge } from "../../../components/hooks/dateHook.js";

const PatientCard = ({ patient }) => {
  return (
    <View style={styles.card}>
      {/* Left section with image and details */}
      <View style={styles.leftSection}>
        <Image
          source={{ uri: patient?.profile_image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          {/* <Text style={styles.id}>{patient.id}</Text> */}
          <Text style={styles.name}>
            {patient?.first_name + " " + patient?.last_name}
          </Text>
          <View style={styles.row}>
            <Text style={styles.detail}>
              Age: {getAge(patient?.date_of_birth)}
            </Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.detail}>{patient?.gender}</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.detail}>{patient?.blood_group}</Text>
          </View>
        </View>
      </View>

      {/* Right section with booking info */}
      <View style={styles.rightSection}>
        <Text style={styles.bookingLabel}>
          <Icon name="calendar" size={12} /> Last Booking
        </Text>
        <Text style={styles.bookingDate}>{patient.lastBooking}</Text>
      </View>
    </View>
  );
};

export default PatientCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    marginBottom: 10,
    marginTop: 25,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#eee",
  },

  id: {
    color: "#0d6efd",
    fontSize: 12,
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  detail: {
    color: "#6c757d",
    fontSize: 12,
    marginRight: 6,
  },
  separator: {
    color: "#6c757d",
    fontSize: 12,
    marginHorizontal: 4,
  },
  rightSection: {
    // alignItems: "flex-end",
  },
  bookingLabel: {
    color: "#6c757d",
    fontSize: 12,
    marginBottom: 2,
  },
  bookingDate: {
    color: "#6c757d",
    fontSize: 12,
  },
});
