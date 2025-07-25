import { useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";

import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrescriptions } from "../../../redux/slices/patient/profile/medicalRecordSlice";
import {
  formatReadableDate,
  useFriendlyDate,
} from "../../../components/hooks/dateHook.js";

const PrescriptionScreen = ({ id }) => {
  const dispatch = useDispatch();
  const { prescriptions } = useSelector((state) => state.medical);

  const formateDate = useFriendlyDate();

  const additional = prescriptions?.additionaldetail?.[0] || {};

  useEffect(() => {
    dispatch(fetchPrescriptions({ appointment_id: id }));
  }, [dispatch, id]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Header: Date + Download */}
        <View style={[styles.rowBetween, styles.header]}>
          <Text style={styles.invalidDate}>
            {formateDate(additional.created_at)}
          </Text>
          {/* <TouchableOpacity style={styles.downloadButton}>
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity> */}
        </View>

        <Text style={styles.prescriptionId}>DOC247</Text>

        {/* Doctor + Patient Info */}
        <View style={styles.detailsRow}>
          <View style={styles.detailsColumn}>
            <Text style={styles.sectionTitle}>Doctor Details</Text>
            <Text style={styles.detailsText}>
              {prescriptions?.doctor_name || "—"}
            </Text>
          </View>
          <View style={[styles.detailsColumn, { alignItems: "flex-end" }]}>
            <Text style={[styles.sectionTitle, { textAlign: "right" }]}>
              Patient Details
            </Text>
            <Text style={[styles.detailsText, { textAlign: "right" }]}>
              {prescriptions?.patient_name || "—"}
            </Text>
            <Text>
              {(prescriptions?.patient_country_code || "") +
                " " +
                (prescriptions?.patient_phone || "")}
            </Text>
          </View>
        </View>

        {/* Prescription Table */}
        <Text style={styles.sectionHeader}>Prescription Details</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCell}>Medicine</Text>
          <Text style={styles.tableCell}>Type</Text>
          <Text style={styles.tableCell}>Dosage</Text>
          <Text style={styles.tableCell}>Duration</Text>
        </View>

        {prescriptions?.prescriptions?.map((medicine, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{medicine.name}</Text>
              <Text style={styles.tableCell}>{medicine.type}</Text>
              <Text style={styles.tableCell}>{medicine.dosage}</Text>
              <Text style={styles.tableCell}>{medicine.duration}</Text>
            </View>
            <Text style={styles.instructionsText}>{medicine.instructions}</Text>
          </View>
        ))}

        {/* Medical Record Summary */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Record Info</Text>
          <Text style={styles.label}>History:</Text>
          <Text style={styles.noData}>
            {additional.previous_medical_history || "—"}
          </Text>

          <Text style={styles.label}>Complaints:</Text>
          <Text style={styles.noData}>{additional.complaints || "—"}</Text>

          <Text style={styles.label}>Clinical Notes:</Text>
          <Text style={styles.noData}>{additional.clinical_notes || "—"}</Text>

          <Text style={styles.label}>Lab Tests:</Text>
          <Text style={styles.noData}>
            {additional.laboratory_tests || "—"}
          </Text>
        </View>

        {/* Advice Section */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Advice</Text>
          <Text style={styles.noData}>{additional.advice || "—"}</Text>
        </View>

        {/* Follow-up Section */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Follow Up</Text>
          <Text style={styles.noData}>{additional.follow_up || "—"}</Text>
          <Text style={[styles.noData, { fontWeight: "bold", marginTop: 5 }]}>
            Follow-up Date: {formatReadableDate(additional.follow_up_date)}
          </Text>
        </View>

        <Text style={styles.footer}>General Physician</Text>
      </View>
    </ScrollView>
  );
};

export default PrescriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginBottomBottom: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 5,
  },
  invalidDate: {
    padding: 5,
    borderRadius: 5,
    color: "#333",
  },
  downloadButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  downloadText: {
    color: "#fff",
    fontWeight: "600",
  },
  prescriptionId: {
    color: "#007bff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  detailsColumn: {
    flex: 1,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  detailsText: {
    color: "#555",
  },
  sectionHeader: {
    fontWeight: "700",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
  },
  noData: {
    marginTop: 4,
    color: "#666",
  },
  infoBox: {
    marginTop: 20,
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 6,
  },
  infoTitle: {
    fontWeight: "600",
    marginBottom: 5,
  },
  label: {
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 2,
    color: "#333",
  },
  footer: {
    marginTop: 20,
    fontStyle: "italic",
    textAlign: "right",
    color: "#555",
    marginBottom: 40,
  },
  tableRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 4,
  },
  instructionsText: {
    width: "100%",
    fontSize: 12,
    color: "#797979",
    paddingRight: 5,
    marginBottom: 8,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: "#b2b2b2",
  },
});
