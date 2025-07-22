import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import Feather from "react-native-vector-icons/Feather.js";
import PrescriptionScreen from "./PrescriptionScreen.jsx";
import { formatReadableDate } from "../../../components/hooks/dateHook.js";

const { height: screenHeight } = Dimensions.get("window");

const headers = [
  "Record Date",
  "Doctor",
  "Follow Up",
  "Follow Up Date",
  "Action",
];

const columnWidths = [120, 150, 150, 150, 150, 140, 120, 100];

const MedicalRecords = ({ records }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeRecordId, setActiveRecordId] = useState(null);

  const openModal = (id) => {
    console.log("open modal");
    setActiveRecordId(id);
    setModalVisible(true);
  };
  const closeModal = () => setModalVisible(false);

  const deleteRecord = () => {
    console.log("delete record");
  };

  return (
    <>
      <ScrollView horizontal>
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
          {records.map((record, rowIndex) => (
            <View
              key={record.id}
              style={[
                styles.row,
                { backgroundColor: rowIndex % 2 === 0 ? "#f9f9f9" : "#fff" },
              ]}
            >
              <Text style={[styles.cell, { width: columnWidths[0] }]}>
                {formatReadableDate(record.created_at)}
              </Text>
              <Text style={[styles.cell, { width: columnWidths[1] }]}>
                {record.doctor_name}
              </Text>

              <Text style={[styles.cell, { width: columnWidths[2] }]}>
                {record.follow_up}
              </Text>
              <Text style={[styles.cell, { width: columnWidths[3] }]}>
                {formatReadableDate(record.follow_up_date)}
              </Text>
              <View style={[styles.actionCell, { width: columnWidths[4] }]}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => openModal(record?.appointment_id)}
                >
                  <Feather name="eye" size={18} color="#007bff" />
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.iconButton}>
                  <Feather name="edit-2" size={12} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Feather name="download" size={12} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Feather name="trash-2" size={12} color="#dc3545" />
                </TouchableOpacity> */}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal - Using React Native's built-in Modal for full screen bypass */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Feather name="x" size={24} color="#333" />
          </TouchableOpacity>
          <PrescriptionScreen id={activeRecordId} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
    paddingBottom: 40,
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
    // borderRightWidth: 1,
    borderColor: "#ccc",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#333",
  },
  actionCell: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "space-between",
    paddingLeft: 15,
  },
  iconButton: {
    paddingHorizontal: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 16,
    zIndex: 1000,
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MedicalRecords;
