import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { ActivityIndicator, List, useTheme, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  resetOrderstate,
} from "../../../redux/slices/app_common/utility/orderSlice";
import { fetchFiltername } from "../../../redux/slices/app_common/required/RequiredSlice";
import PrescriptionView from "./PrescriptionView";
import GestureRecognizer from "react-native-swipe-gestures";
import { useToast } from "../../../components/utility/Toast";

const Order = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { orders, loading, error, success, message } = useSelector(
    (state) => state.order
  );
  const { requiredFields } = useSelector((state) => state.required);
  const { showToast } = useToast();
  const [activePrescriptionId, setActivePrescriptionId] = useState(null);
  const statusTabs = ["All", "Pending", "Completed", "Rejected", "Cancelled"];
  const [activeStatus, setActiveStatus] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  console.log(activeStatus);

  const getorders = useCallback(() => {
    dispatch(fetchOrders({ patientId: userId, status: activeStatus }));
  }, [dispatch, userId, activeStatus]);

  useEffect(() => {
    getorders();
    dispatch(fetchFiltername("order_status"));
  }, [getorders, dispatch, activeStatus]);

  useEffect(() => {
    if (message === null) return;
    showToast(message, success ? "success" : "error");
    dispatch(resetOrderstate());
    if (success) {
      getorders();
    }
  }, [success, message, error, dispatch, getorders, showToast]);

  const getStatusLabel = (value) => {
    const status =
      requiredFields && requiredFields.find((s) => s.value === value);
    return status ? status.label : "Unknown";
  };

  const handleViewPrescription = (groupId) => {
    if (activePrescriptionId === groupId) {
      setActivePrescriptionId(null);
    } else {
      setActivePrescriptionId(groupId);
    }
  };

  const filteredOrders = orders
    ? activeStatus === 0
      ? orders
      : orders.filter(
          (order) => getStatusLabel(order.status) === statusTabs[activeStatus]
        )
    : [];

  const onSwipeLeft = () => {
    if (activeStatus < statusTabs.length - 1)
      setActiveStatus((prev) => prev + 1);
  };

  const onSwipeRight = () => {
    if (activeStatus > 0) setActiveStatus((prev) => prev - 1);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getorders();
    setRefreshing(false);
  };

  const renderOrderItem = ({ item: order }) => (
    <List.Section key={order.id} style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Order #{order.id}</Text>
        <Text style={styles.sectionTitle}>{getStatusLabel(order.status)}</Text>
      </View>

      <View style={styles.section}>
        {order?.pharmacy_first_name && (
          <Text style={styles.sectionTitle}>{order?.pharmacy_first_name}</Text>
        )}
        {order?.pharmacy_contact && (
          <Text style={styles.value}>
            +{order?.country_code}-{order?.pharmacy_contact}
          </Text>
        )}
        {order?.pharmacy_email && (
          <Text style={styles.value}>{order?.pharmacy_email}</Text>
        )}
        {order?.pharmacy_address && (
          <Text style={styles.value}>{order?.pharmacy_address}</Text>
        )}
      </View>

      {activePrescriptionId === order.prescription_group_id && (
        <PrescriptionView prescriptionGroupId={order?.prescription_group_id} />
      )}
      <TouchableOpacity
        onPress={() => handleViewPrescription(order.prescription_group_id)}
        style={styles.viewButton}
      >
        <Text style={styles.viewButtonText}>
          {activePrescriptionId === order.prescription_group_id
            ? "Hide Prescription"
            : "View Prescription"}
        </Text>
      </TouchableOpacity>
    </List.Section>
  );

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.tabBar}>
          {statusTabs.map((tab, idx) => (
            <TouchableOpacity key={tab} onPress={() => setActiveStatus(idx)}>
              <Text
                style={[
                  styles.tabText,
                  activeStatus === idx && styles.activeTab,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={{
            paddingBottom: 10, // Allow bottom space to scroll
            ...(filteredOrders.length === 0 && {
              flex: 1,
              justifyContent: "center",
            }),
          }}
          ListEmptyComponent={() =>
            loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100%",
                }}
              >
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.text }]}>
                  No Vitals Found
                </Text>
              </View>
            )
          }
        />
      </SafeAreaView>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 60,
    zIndex: 1,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    elevation: 2,
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 14,
    color: "#333",
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  activeTab: {
    fontWeight: "bold",
    color: "#007AFF",
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 10,
    elevation: 2,
  },
  headerRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#2a7dc4",
  },
  value: {
    color: "#444",
    fontSize: 14,
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minHeight: "100%",
    zIndex: 1,
    paddingBottom: 200,
  },
  noData: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
  viewButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: "center",
    marginTop: 10,
  },
  viewButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: "50%",
  },
  emptyText: { fontSize: 18, fontWeight: "bold", opacity: 0.6 },
});

export default Order;
