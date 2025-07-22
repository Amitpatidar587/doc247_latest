import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const sampleData = [
  {
    id: "RX001",
    prescribedBy: {
      name: "Dr. Amelia Watson",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    type: "Oral Medication",
    date: "2025-05-10",
  },
  {
    id: "RX002",
    prescribedBy: {
      name: "Dr. Isaac Clarke",
      image: "https://randomuser.me/api/portraits/men/29.jpg",
    },
    type: "Injection",
    date: "2025-05-20",
  },
  {
    id: "RX003",
    prescribedBy: {
      name: "Dr. Hannah Lee",
      image: "https://randomuser.me/api/portraits/women/51.jpg",
    },
    type: "Physiotherapy",
    date: "2025-06-01",
  },
];

const headers = ["ID", "Prescribed By", "Type", "Date", "Action"];
const columnWidths = [80, 180, 140, 100, 80];

const PrescriptionTable = () => {
  return (
    <ScrollView horizontal style={styles.container}>
      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.row, styles.headerRow]}>
          {headers.map((title, index) => (
            <Text
              key={index}
              style={[
                styles.cell,
                styles.headerCell,
                { width: columnWidths[index] },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          ))}
        </View>

        {/* Data Rows */}
        {sampleData.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.row,
              { backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" },
            ]}
          >
            <Text style={[styles.cell, { width: columnWidths[0] }]}>
              {item.id}
            </Text>

            <View
              style={[
                styles.cell,
                styles.doctorCell,
                { width: columnWidths[1] },
              ]}
            >
              <Image
                source={{ uri: item.prescribedBy.image }}
                style={styles.avatar}
              />
              <Text numberOfLines={1}>{item.prescribedBy.name}</Text>
            </View>

            <Text
              style={[styles.cell, { width: columnWidths[2] }]}
              numberOfLines={1}
            >
              {item.type}
            </Text>
            <Text
              style={[styles.cell, { width: columnWidths[3] }]}
              numberOfLines={1}
            >
              {item.date}
            </Text>

            <View
              style={[
                styles.cell,
                styles.actionCell,
                { width: columnWidths[4] },
              ]}
            >
              <TouchableOpacity style={styles.iconButton}>
                <MaterialCommunityIcons name="link" size={12} color="#007bff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  headerRow: {
    backgroundColor: "#e4e7f1",
  },
  cell: {
    padding: 10,
    fontSize: 12,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#333",
  },
  doctorCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 8,
  },
  actionCell: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    paddingHorizontal: 4,
  },
});

export default PrescriptionTable;
