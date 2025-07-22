import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PatientMedicalTable from "./PatientMedicalTable";
import { fetchMedicalRecordsById } from "../../../redux/slices/patient/patientSlice";

export default function PatientMedicalRecords() {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { medicalRecords, loading } = useSelector((state) => state.patient);

  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecords = useCallback(
    async (fresh = false) => {
      if (fresh) setRefreshing(true);
      await dispatch(
        fetchMedicalRecordsById({
          payload: {
            patient_id: userId,
            page: fresh ? 1 : page,
            page_size: 20,
          },
        })
      );
      if (fresh) setRefreshing(false);
    },
    [dispatch, userId, page]
  );

  // initial load
  useEffect(() => {
    loadRecords(true);
  }, [loadRecords]);

  // pagination
  const handleEndReached = () => {
    if (!loading && medicalRecords.length >= page * 20) {
      setPage((p) => p + 1);
    }
  };
  useEffect(() => {
    if (page > 1) loadRecords();
  }, [page, loadRecords]);

  return (
    <View style={styles.container}>
      {loading && page === 1 ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={medicalRecords}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PatientMedicalTable medicalRecord={item} />
          )}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setPage(1);
                loadRecords(true);
              }}
            />
          }
          ListEmptyComponent={
            !loading &&
            !refreshing && (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No medical records found.</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingBottom: 50 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
    zIndex: 1,
    paddingBottom: 60

  },
  emptyText: { fontSize: 18, color: "gray", fontWeight:"bold" },
});
