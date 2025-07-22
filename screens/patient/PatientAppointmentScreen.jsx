import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { List, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import AppointmentCard from "../../components/cards/AppointmentCard";
import {
  deleteAppointment,
  fetchAppointments,
  resetAppointmentState,
  resetAppointmentsList,
  updateAppointment,
} from "../../redux/slices/app_common/AppointmentSlice";
import { useTheme } from "@react-navigation/native";
import GestureRecognizer from "react-native-swipe-gestures";
import { useToast } from "../../components/utility/Toast";

const statusTabs = ["pending", "approved", "rejected", "completed"];

const PatientAppointmentScreen = ({ route }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const initializedRef = useRef(false);
  const { status: routeStatus } = route.params || {};
  console.log("routeStatus", routeStatus);
  const { userId, userRole } = useSelector((state) => state.auth);
  const { loading, error, appointments, pagination, message, success } =
    useSelector((state) => state.appointment);

  const [statusIndex, setStatusIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [resetting, setResetting] = useState(false);
  const status = statusTabs[statusIndex];

  const fetchAppointment = useCallback(
    async (newPage) => {
      try {
        await dispatch(
          fetchAppointments({
            patient_id: userRole === "patient" ? userId : null,
            doctor_id: userRole === "doctor" ? userId : null,
            search: {
              search: "",
              page: newPage,
              page_size: 10,
              appointment_date: "",
              visitType: "",
              appointmentType: "",
            },
            status: status,
            append: newPage > 1,
          })
        );
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    },
    [dispatch, userId, userRole, status]
  );

  useEffect(() => {
    if (!initializedRef.current) {
      let index = 0;
      if (routeStatus) {
        const foundIndex = statusTabs.indexOf(routeStatus.toLowerCase());
        if (foundIndex !== -1) index = foundIndex;
      }
      setStatusIndex(index);
      initializedRef.current = true;
    }
  }, [routeStatus]);

  useEffect(() => {
    setResetting(true); // Prevent fetch until reset done
    dispatch(resetAppointmentsList());
    setPage(1);
  }, [statusIndex, dispatch]);

  useEffect(() => {
    if (resetting) {
      setResetting(false); // allow fetch next cycle
      return;
    }
    fetchAppointment(page);
  }, [page, resetting, fetchAppointment]);

  useEffect(() => {
    if (message === null) return;
    showToast(message, success ? "success" : "error");
    if (success) fetchAppointment(1);
    dispatch(resetAppointmentState());
  }, [success, error, message, dispatch, fetchAppointment]);

  const onCancel = async (id) => {
    await dispatch(
      updateAppointment({ appointmentId: id, status: "rejected" })
    );
  };

  const UpdateAppoinmentStatus = async (id, status) => {
    await dispatch(updateAppointment({ appointmentId: id, status }));
  };

  const onDelete = async (id) => {
    await dispatch(deleteAppointment(id));
  };

  const onSwipeLeft = () => {
    if (!resetting && statusIndex < statusTabs.length - 1) {
      setStatusIndex((prev) => prev + 1);
      setPage(1);
    }
  };

  const onSwipeRight = () => {
    if (!resetting && statusIndex > 0) {
      setStatusIndex((prev) => prev - 1);
      setPage(1);
    }
  };

  const onEndReached = () => {
    if (!loading && pagination?.current_page < pagination?.total_pages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const uniqueAppointments = Array.from(
    new Map(appointments.map((item) => [item.id, item])).values()
  );
  const swipeConfig = {
    velocityThreshold: 0.5, // default is 0.3
    directionalOffsetThreshold: 100, // default is 80
  };

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={swipeConfig}
      style={styles.container}
    >
      <List.Section style={styles.listSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.buttonGroup}
        >
          {statusTabs.map((stat, index) => (
            <TouchableOpacity
              key={stat}
              style={[
                styles.statusButton,
                {
                  backgroundColor:
                    index === statusIndex ? colors.primary : "#fff",
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => {
                setStatusIndex(index), setPage(1);
              }}
            >
              <Text
                style={{
                  color: index === statusIndex ? "#fff" : colors.primary,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 13,
                  lineHeight: 32,
                }}
              >
                {stat.charAt(0).toUpperCase() + stat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {uniqueAppointments && (
          <FlatList
            data={uniqueAppointments}
            keyExtractor={(item, index) =>
              item?.id ? item.id.toString() : `key-${index}`
            }
            renderItem={({ item }) => (
              <AppointmentCard
                onDelete={onDelete}
                onUpdateStatus={UpdateAppoinmentStatus}
                appointment={item}
                onCancel={() => onCancel(item.id)}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={resetting}
                onRefresh={() => {
                  setResetting(true);
                  setPage(1);
                }}
              />
            }
            contentContainerStyle={[styles.listContent]}
            showsVerticalScrollIndicator={false}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              !resetting && loading && pagination?.current_page > 1 ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : null
            }
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100%",
                  paddingBottom: 60,
                  marginTop: "45%",
                }}
              >
                <Text style={styles.noAppointments}>No Appointments Found</Text>
              </View>
            )}
          />
        )}
      </List.Section>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    marginBottom: 60,
  },
  buttonGroup: {
    flex: 1,
    marginBottom: 5,
    justifyContent: "center",
  },
  statusButton: {
    height: 35,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  listSection: {
    width: "100%",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 0,
    paddingBottom: 60,
  },
  noAppointments: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    fontWeight: "bold",
  },
});

export default PatientAppointmentScreen;
