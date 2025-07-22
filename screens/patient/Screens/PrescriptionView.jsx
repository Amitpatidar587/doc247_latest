// components/PrescriptionView.js

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
// import { Button, List } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrescription } from "../../../redux/slices/app_common/utility/orderSlice";

const PrescriptionView = ({ prescriptionGroupId, appointmentId }) => {
  const dispatch = useDispatch();
  // const [expanded, setExpanded] = useState(false);
  const { prescription } = useSelector((state) => state.order);
  // const [viewPrescription, setViewPrescription] = useState(false);
  // const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // if (viewPrescription && !hasFetched) {
    const params = {
      id: prescriptionGroupId,
      appointment_id: appointmentId,
    };
    dispatch(fetchPrescription(params));
    // console.log(prescriptionGroupId);
    // setHasFetched(true);
    // }
  }, [prescriptionGroupId, appointmentId]);

  // console.log(
  //   "prescription",
  //   prescriptionGroupId,
  //   "prescriptionGroupId",
  //   prescription
  // );
  // console.log("prescription", appointmentId);
  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.cell]}>Medicine</Text>
        <Text style={[styles.headerCell, styles.cell]}>Dosage</Text>
        <Text style={[styles.headerCell, styles.cell]}>Duration</Text>
        {/* <Text style={[styles.headerCell, styles.cell]}>Instructions</Text> */}
      </View>
      <ScrollView style={styles.tableBody}>
        {prescription?.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.dosage}</Text>
            <Text style={styles.cell}>{item.duration} days</Text>
            {/* <Text style={styles.cell}>{item.instruction || "-"}</Text> */}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 5,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f4f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableBody: {
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerCell: {
    fontWeight: "bold",
    color: "#333",
  },
  cell: {
    flex: 1,
    padding: 8,
    textAlign: "left",
    fontSize: 13,
    color: "#333",
  },
});

export default PrescriptionView;
