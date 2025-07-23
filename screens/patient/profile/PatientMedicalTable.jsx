import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrescription } from "../../../redux/slices/app_common/utility/orderSlice";
import DefaultAvatar from "../../../assets/doctor.jpg";
import { format } from "date-fns";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PrescriptionView from "../Screens/PrescriptionView";
import { Avatar, useTheme } from "react-native-paper";

export default function PatientMedicalTable({ medicalRecord }) {
  const dispatch = useDispatch();
  const { prescription, loading, error } = useSelector((state) => state.order);

  const { colors } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [activeAppointmentId, setActiveAppointmentId] = useState(null);

  const openModal = (appointmentId) => {
    setActiveAppointmentId(appointmentId);
    setModalVisible(true);
  };

  // const closeModal = () => {
  //   setModalVisible(false);
  //   // setActiveAppointmentId(null);
  // };

  // const getPrescription = useCallback(
  //   async (appointmentId) => {
  //     try {
  //       dispatch(fetchPrescription({ appointmentId }));
  //     } catch (error) {
  //       console.error("Failed to fetch prescription:", error);
  //     }
  //   },
  //   [dispatch]
  // );

  // Fetch prescription when modal is opened and appointment ID changes
  // useEffect(() => {
  //   if (modalVisible && activeAppointmentId) {
  //     getPrescription(activeAppointmentId);
  //   }
  // }, [modalVisible, activeAppointmentId, getPrescription]);

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "d MMM yyy");
  }
  // console.log("medicalRecords", medicalRecords);
  // const rendermedicalRecord = ({medicalRecord}) => (
  //   <View style={[styles.card, {gap: 10}]}>
  //     {/* <TouchableOpacity style={styles.cardHeader}>
  //       <Text style={styles.recordId}>Record ID: {medicalRecord?.id || "N/A"}</Text>
  //     </TouchableOpacity> */}
  //     <View style={styles.row}>
  //       {medicalRecord?.doctor_image ? (
  //         <Image
  //           size={50}
  //           source={{uri: medicalRecord?.doctor_image}}
  //           style={[
  //             styles.avatar,
  //             {backgroundColor: colors.primary, marginRight: 10},
  //           ]}
  //         />
  //       ) : (
  //         <Avatar.Text
  //           size={50}
  //           label={medicalRecord?.doctor_name?.[0].toUpperCase() || '?'}
  //           style={[
  //             styles.avatar,
  //             {backgroundColor: colors.primary, marginRight: 10},
  //           ]}
  //         />
  //       )}
  //       <View style={styles.recordIdContainer}>
  //         <Text style={styles.recordId}>Dr. {medicalRecord?.doctor_name}</Text>
  //       </View>
  //     </View>
  //     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
  //       <View style={[styles.detailRow, {flex: 1}]}>
  //         <Text style={{fontSize: 12, color: '#666'}}>Record Date: </Text>
  //         <Text style={[styles.value, {color: '#000'}]}>
  //           {formatDate(medicalRecord?.created_at) || 'N/A'}
  //         </Text>
  //       </View>
  //       <View style={[styles.detailRow, {flex: 1}]}>
  //         <Text style={{fontSize: 12, color: '#666'}}>Follow Up: </Text>
  //         <Text style={[styles.value, {color: '#000'}]}>
  //           {formatDate(medicalRecord?.follow_up_date) || 'N/A'}
  //         </Text>
  //       </View>
  //     </View>
  //     <View
  //       style={{
  //         flexDirection: 'row',
  //         flexWrap: 'wrap',
  //         gap: 20,
  //       }}>
  //       <View style={styles.detailRow}>
  //         <Text style={{fontSize: 12, color: '#666'}}>History: </Text>
  //         <Text style={[styles.value, {color: '#000'}]}>
  //           {medicalRecord?.previous_medical_history || 'N/A'}
  //         </Text>
  //       </View>

  //       <View style={styles.detailRow}>
  //         <Text style={{fontSize: 12, color: '#666'}}>Lab Tests: </Text>
  //         <Text style={[styles.value, {color: '#000'}]}>
  //           {medicalRecord?.laboratory_tests || 'N/A'}
  //         </Text>
  //       </View>

  //       <View style={styles.detailRow}>
  //         <Text style={{fontSize: 12, color: '#666'}}>Advice: </Text>
  //         <Text style={[styles.value, {color: '#000'}]}>
  //           {medicalRecord?.advice || 'N/A'}
  //         </Text>
  //       </View>
  //     </View>
  //     {activeAppointmentId === medicalRecord.appointment_id && (
  //       <PrescriptionView appointmentId={medicalRecord.appointment_id} />
  //     )}
  //     <View style={styles.detailRow}>
  //       <TouchableOpacity
  //         onPress={() =>
  //           setActiveAppointmentId(prev =>
  //             prev === medicalRecord.appointment_id ? null : medicalRecord.appointment_id,
  //           )
  //         }
  //         style={{
  //           flexDirection: 'row',
  //           alignmedicalRecords: 'center',
  //           gap: 5,
  //           borderWidth: 1,
  //           borderColor: '#007BFF',
  //           textAlign: 'center',
  //           paddingVertical: 5,
  //           paddingHorizontal: 10,
  //           borderRadius: 20,
  //           justifyContent: 'center',
  //         }}>
  //         <MaterialCommunityIcons name="list-alt" color={'#007BFF'} size={14} />
  //         <Text
  //           style={{
  //             color: '#007BFF',
  //             textAlign: 'center',
  //             fontSize: 14,
  //             fontWeight: 'bold',
  //           }}>
  //           {activeAppointmentId === medicalRecord.appointment_id
  //             ? 'Hide Prescription'
  //             : 'View Prescription'}
  //         </Text>
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );
  return (
    <>
      {/* <FlatList
        data={medicalRecords}
        rendermedicalRecord={rendermedicalRecord}
        keyExtractor={medicalRecord => medicalRecord.id.toString()}
        contentContainerStyle={styles.container}
      /> */}

      <View style={styles.container}>
        <View style={[styles.card, { gap: 10 }]}>
          {/* <TouchableOpacity style={styles.cardHeader}>
        <Text style={styles.recordId}>Record ID: {medicalRecord?.id || "N/A"}</Text>
      </TouchableOpacity> */}
          <View style={styles.row}>
            {medicalRecord?.doctor_image ? (
              <Image
                size={50}
                source={{ uri: medicalRecord?.doctor_image }}
                style={[
                  styles.avatar,
                  { backgroundColor: colors.primary, marginRight: 10 },
                ]}
              />
            ) : (
              <Avatar.Text
                size={50}
                label={medicalRecord?.doctor_name?.[0].toUpperCase() || "?"}
                style={[
                  styles.avatar,
                  { backgroundColor: colors.primary, marginRight: 10 },
                ]}
              />
            )}
            <View style={styles.recordIdContainer}>
              <Text style={styles.recordId}>
                Dr. {medicalRecord?.doctor_name}
              </Text>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={[styles.detailRow, { flex: 1 }]}>
              <Text style={{ fontSize: 12, color: "#666" }}>Record Date: </Text>
              <Text style={[styles.value, { color: "#000" }]}>
                {formatDate(medicalRecord?.created_at) || "N/A"}
              </Text>
            </View>
            <View style={[styles.detailRow, { flex: 1 }]}>
              <Text style={{ fontSize: 12, color: "#666" }}>Follow Up: </Text>
              <Text style={[styles.value, { color: "#000" }]}>
                {formatDate(medicalRecord?.follow_up_date) || "N/A"}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <View style={styles.detailRow}>
              <Text style={{ fontSize: 12, color: "#666" }}>History: </Text>
              <Text style={[styles.value, { color: "#000" }]}>
                {medicalRecord?.previous_medical_history || "N/A"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={{ fontSize: 12, color: "#666" }}>Lab Tests: </Text>
              <Text style={[styles.value, { color: "#000" }]}>
                {medicalRecord?.laboratory_tests || "N/A"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={{ fontSize: 12, color: "#666" }}>Advice: </Text>
              <Text style={[styles.value, { color: "#000" }]}>
                {medicalRecord?.advice || "N/A"}
              </Text>
            </View>
          </View>
          {activeAppointmentId === medicalRecord.appointment_id && (
            <PrescriptionView appointmentId={medicalRecord.appointment_id} />
          )}
          <View style={styles.detailRow}>
            <TouchableOpacity
              onPress={() =>
                setActiveAppointmentId((prev) =>
                  prev === medicalRecord.appointment_id
                    ? null
                    : medicalRecord.appointment_id
                )
              }
              style={{
                flexDirection: "row",
                alignmedicalRecords: "center",
                gap: 5,
                borderWidth: 1,
                borderColor: "#007BFF",
                textAlign: "center",
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 20,
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="pill"
                color={"#007BFF"}
                size={20}
              />
              <Text
                style={{
                  color: "#007BFF",
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {activeAppointmentId === medicalRecord.appointment_id
                  ? "Hide Prescription"
                  : "View Prescription"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal for prescription */}
      {/* <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Prescription</Text>
            <ScrollView style={styles.modalContent}>
              {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
              ) : error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
              ) : prescription?.length > 0 ? (
                prescription.map((medicalRecord, index) => (
                  <View key={medicalRecord.id || index} style={styles.prescriptionmedicalRecord}>
                    <Text style={styles.prescriptionLabel}>Name:</Text>
                    <Text style={styles.prescriptionValue}>
                      {medicalRecord?.name || "N/A"}
                    </Text>

                    <Text style={styles.prescriptionLabel}>Dosage:</Text>
                    <Text style={styles.prescriptionValue}>
                      {medicalRecord?.dosage || "N/A"}
                    </Text>

                    <Text style={styles.prescriptionLabel}>Duration:</Text>
                    <Text style={styles.prescriptionValue}>
                      {medicalRecord?.duration || "N/A"}
                    </Text>

                    <Text style={styles.prescriptionLabel}>Instruction:</Text>
                    <Text style={styles.prescriptionValue}>
                      {medicalRecord?.instruction || "N/A"}
                    </Text>
                  </View>
                ))
              ) : (
                <Text>No prescription found for this appointment.</Text>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
    </>
  );
}

PatientMedicalTable.propTypes = {
  medicalRecords: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    // elevation: 3,
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 4px 0px",
  },
  cardHeader: {
    marginBottom: 10,
  },
  recordId: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#007BFF",
    textTransform: "capitalize",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignmedicalRecords: "center",
    // marginVertical: 6,
  },
  detailRow: {
    flexDirection: "column",
    // marginVertical: 4,
    width: "auto",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  label: {
    fontWeight: "600",
    color: "#333",
    marginRight: 5,
    width: 80,
  },
  value: {
    flex: 1,
    color: "#555",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  prescriptionButtonText: {
    color: "#007BFF",
    fontWeight: "600",
  },
  prescriptionmedicalRecord: {
    marginBottom: 15,
  },
  prescriptionLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  prescriptionValue: {
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignmedicalRecords: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContent: {
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    paddingVertical: 10,
    alignmedicalRecords: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
  },
});
