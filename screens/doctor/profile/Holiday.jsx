import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomForm from "../../../components/forms/CustomForm";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  dayOffAvailability,
  deleteDayOff,
  getDayOff,
  resetAvailability,
} from "../../../redux/slices/doctor/doctorutility/availabilitySlice";

import { useTheme } from "react-native-paper";
import { format } from "date-fns";
import { useToast } from "../../../components/utility/Toast";
import { FlatList } from "react-native-gesture-handler";

const Holiday = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { dayOff, loading, error, message, success } = useSelector(
    (state) => state.availability
  );
  const { showToast } = useToast();
  const [ModalVisible, setModalVisible] = useState(false);
  const [dayOffFormData, setDayOffFormData] = useState({
    off_date: "",
    doctor_id: userId,
    reason: "",
  });

  useEffect(() => {
    if (message === null) return;
    showToast(message, success ? "success" : "error");

    dispatch(resetAvailability());
    fetchDayOff();
  }, [success, error, message]);

  const setDayOffFieldValue = (name, value) => {
    setDayOffFormData((prev) => ({ ...prev, [name]: value }));
  };

  const dayOffFields = [
    {
      name: "reason",
      type: "text",
      label: "Holiday Name",
      value: dayOffFormData?.reason,
      required: true,
    },
    {
      name: "off_date",
      type: "date",
      label: "Holiday Date",
      value: dayOffFormData?.off_date,
      disablePastDates: true,
      required: true,
    },
  ];

  const handleMarkDayOff = async () => {
    try {
      await dispatch(dayOffAvailability(dayOffFormData));
      setModalVisible(false);
      setDayOffFormData({
        off_date: "",
        doctor_id: userId,
        reason: "",
      });
    } catch (error) {
      alert("Failed to mark day off: " + error.message);
    }
  };

  const fetchDayOff = useCallback(async () => {
    try {
      await dispatch(getDayOff(userId));
    } catch (error) {
      alert("Failed to fetch day off: " + error.message);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (dayOff?.length > 0) return;
    fetchDayOff();
  }, [fetchDayOff]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDayOff();
    setRefreshing(false);
  };

  const handleDeleteDayOff = async (id) => {
    try {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to delete this day off?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => dispatch(deleteDayOff(id)),
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      alert("Failed to delete day off: " + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "d MMM yyyy");
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Holiday Settings</Text> */}

      {/* Day Off Cards */}

      <FlatList
        data={dayOff}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.cardList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardDate}>{formatDate(item?.off_date)}</Text>
              <Text style={styles.cardReason}>
                {item.reason || "No reason given"}
              </Text>
            </View>
            {/* Delete Button */}

            <TouchableOpacity
              style={[
                styles.deleteButton,
                {
                  borderColor: "red",
                  borderWidth: 1,
                  minWidth: 60,
                },
              ]}
              onPress={() => handleDeleteDayOff(item.id)}
            >
              <Text style={{ color: "red", fontWeight: "700" }}>Delete</Text>
              {/* <Icon name="delete" size={20} color="#fff" /> */}
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.noDayOffContainer}>
            <Text style={styles.noDayOffText}>No Day Off</Text>
          </View>
        }
      />
      <View
        style={{
          paddingHorizontal: 15,
          paddingBottom: 5,
          paddingTop: 5,
        }}
      >
        <TouchableOpacity
          style={[
            styles.dayOffButton,
            {
              borderColor: colors.primary,
              borderWidth: 1,
              backgroundColor: "#fff",
            },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="add-circle" size={20} color={colors.primary} />
          <Text
            style={[
              styles.dayOffButtonText,
              { color: colors.primary, textAlign: "center" },
            ]}
          >
            Add Holiday
          </Text>
        </TouchableOpacity>
      </View>
      {/* Modal */}
      <Modal visible={ModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <CustomForm
              fields={dayOffFields}
              setFieldValue={setDayOffFieldValue}
              isEditing={true}
              loading={loading}
              handleSave={handleMarkDayOff}
              handleCancel={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Holiday;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 16,
    paddingBottom: 60,
  },

  dayOffButton: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    width: "100%",
    textAlign: "center",
    justifyContent: "center",
  },
  dayOffButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
    // textAlign: "center",
  },
  cardList: {
    // flex: 1,
    // marginTop: 20,
    padding: 15,
    // marginBottom: 150,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 4px 0px",
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  cardDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  cardReason: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  deleteButton: {
    // backgroundColor: "#FF3B30",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  noDayOffContainer: {
    flex: 1,
    justifyContent: "center",
    // minHeight: "100%",
    marginTop: "75%",
    alignItems: "center",
  },
  noDayOffText: {
    fontSize: 18,
    color: "gray",
    fontWeight: "bold",
    textAlign: "center",
    // opacity: 0.6,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    height: "50%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#111",
  },
});
