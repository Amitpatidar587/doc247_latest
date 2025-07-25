import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Button, Card, useTheme } from "react-native-paper";
import CustomForm from "../../../components/forms/CustomForm";
import CustomTabBar from "../../../components/navigation/CustomTabBar";
import { useDispatch, useSelector } from "react-redux";

import {
  addAvailability,
  deleteAvailabilityById,
  fetchAvailability,
  resetAvailability,
  updateAvailability,
} from "../../../redux/slices/doctor/doctorutility/availabilitySlice";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import GestureRecognizer from "react-native-swipe-gestures";
import { useToast } from "../../../components/utility/Toast";
import { RefreshControl } from "react-native-gesture-handler";
import validateSlotTimes from "../../../components/hooks/validateSlotTimes.js";

const DoctorAvailability = () => {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [modalVisible, setModalVisible] = useState(false);
  const { Slots, loading, error, message, success } = useSelector(
    (state) => state.availability
  );
  const { showToast } = useToast();
  const { colors } = useTheme();
  const { userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // const [activeDayIndex, setActiveDayIndex] = useState(0);
  const scrollRef = useRef();
  const [generalError, setGeneralError] = useState("");
  const screenWidth = Math.round(Dimensions.get("window").width);
  const handleTabChange = (tabName) => {
    const index = days.indexOf(tabName);
    scrollRef.current?.scrollTo({ x: index * screenWidth, animated: true });
    setSelectedDay(tabName); // <-- Add this line
  };

  const [formData, setFormData] = useState({
    slot_start_time: "",
    slot_end_time: "",
    slot_clinic_id: 0,
    slot_duration: "",
    slot_interval: "",
    slot_available_type: "",
  });

  // const clinics = [
  //   {id: 'main', name: 'Main Clinic'},
  //   {id: 'branch', name: 'Branch Clinic'},
  //   {id: 'community', name: 'Community Health Center'},
  // ];

  const fields = [
    {
      name: "slot_start_time",
      type: "time",
      label: "Start Time",
      value: formData?.slot_start_time,
      required: true,
    },
    {
      name: "slot_end_time",
      type: "time",
      label: "End Time",
      value: formData?.slot_end_time,
      minTime: formData?.slot_start_time,
      required: true,
    },
    // {
    //   name: "clinic",
    //   type: "select",
    //   label: "Clinic",
    //   value: formData.clinic,
    //   options: clinics.map((clinic) => ({
    //     value: clinic.id,
    //     label: clinic.name,
    //   })),
    // },
    {
      name: "slot_duration",
      type: "number",
      label: "Duration in Minutes",
      value: formData?.slot_duration,
      required: true,
    },
    // { name: "fee", type: "number", label: "Fee", value: formData.fee },
    {
      name: "slot_interval",
      type: "number",
      label: "Interval in Minutes",
      value: formData?.slot_interval,
      required: true,
    },
    {
      name: "slot_available_type",
      type: "select",
      label: "Available Type",
      value: formData?.slot_available_type,
      options: [
        { value: "online", label: "Online" },
        { value: "offline", label: "Offline" },
        { value: "both", label: "Both" },
      ],
      required: true,
    },
  ];
  const setFieldValue = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const tabs = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const generateTimeSlots = (start, end, duration, interval, type) => {
    let slots = [];
    let startTime = convertToMinutes(start);
    let endTime = convertToMinutes(end, true); // pass true to flag this is end time

    while (startTime + duration <= endTime) {
      let slotStart = formatTime(startTime);
      let slotEnd = formatTime(startTime + duration);
      slots.push({ start: slotStart, end: slotEnd, type });

      startTime += duration + interval;
    }
    return slots;
  };
  // Modified to handle 12:00 AM correctly when it's the end time
  const convertToMinutes = (time, isEndTime = false) => {
    if (!time) {
      return 0;
    }

    const [rawHour, rawMinute, meridian] = time
      .replace(/ +/g, " ")
      .trim()
      .split(/[: ]/);

    let hour = parseInt(rawHour, 10);
    const minute = parseInt(rawMinute, 10);

    if (meridian.toUpperCase() === "PM" && hour !== 12) {
      hour += 12;
    }
    if (meridian.toUpperCase() === "AM" && hour === 12) {
      hour = 0;
    }

    let totalMinutes = hour * 60 + minute;

    // Handle edge case: 12:00 AM as end of day (1440 mins)
    if (isEndTime && hour === 0 && minute === 0) {
      totalMinutes = 1440;
    }

    return totalMinutes;
  };
  // Convert minutes back to HH:MM AM/PM
  const formatTime = (mins) => {
    let hour = Math.floor(mins / 60);
    let minute = mins % 60;
    let period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
  };
  const convertTo24Hour = (time12h) => {
    if (!time12h) {
      return "";
    }

    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = String(parseInt(hours, 10) + 12);
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours}:${minutes}`;
  };
  const getAvailability = useCallback(async () => {
    try {
      dispatch(
        fetchAvailability({
          doctorId: userId,
          slot_day: selectedDay.toLowerCase(),
        })
      );
    } catch (err) {
      console.log("Error fetching availability:", err);
    }
  }, [dispatch, selectedDay, userId]);

  useEffect(() => {
    if (message === null) return;
    showToast(message, success ? "success" : "error");
    dispatch(resetAvailability());
    if (success) {
      getAvailability();
      setFormData({});
    }
  }, [success, message, error, dispatch, showToast, getAvailability]);
  const handleSave = async () => {
    const errorMessage = validateSlotTimes({
      slotStartTime: formData?.slot_start_time,
      slotEndTime: formData?.slot_end_time,
      slotDuration: Number(formData?.slot_duration),
      slotInterval: Number(formData?.slot_interval),
    });
    if (errorMessage) {
      setGeneralError(errorMessage);
      return;
    }

    const formattedData = {
      ...formData,
      slot_start_time: convertTo24Hour(formData.slot_start_time),
      slot_end_time: convertTo24Hour(formData.slot_end_time),
    };
    const slotDay = selectedDay.toLowerCase();
    try {
      if (formData.id) {
        // Editing existing slot
        await dispatch(updateAvailability({ ...formattedData }));
        setModalVisible(false);
      } else {
        // Adding a new slot
        await dispatch(
          addAvailability({
            slot_doctor_id: userId,
            slot_day: slotDay,
            ...formattedData,
          })
        );
        setModalVisible(false);
      }
    } catch (saveError) {
      console.log("Error saving availability:", saveError);
    }
  };

  const openEditModal = (slot) => {
    setFormData({
      id: slot.id,
      slot_start_time: formatTime(convertToMinutes(slot.slot_start_time)),
      slot_end_time: formatTime(convertToMinutes(slot.slot_end_time)),
      slot_duration: slot.slot_duration,
      slot_interval: slot.slot_interval,
      slot_available_type: slot?.slot_available_type,
    });
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setFormData({
      start: "",
      end: "",
      clinic: "",
      duration: "",
      fee: "",
      interval: "",
      available_type: "",
    });
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this slot?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => dispatch(deleteAvailabilityById(id)),
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    getAvailability();
  }, [selectedDay, getAvailability]);

  const tabIndex = tabs.indexOf(selectedDay);
  const tabBarRef = useRef(null);
  const onSwipeLeft = () => {
    if (tabIndex < tabs.length - 1) {
      setSelectedDay(tabs[tabIndex + 1]);
      tabBarRef.current?.scrollToTab?.(tabs[tabIndex + 1]); // scroll tab bar if supported
    }
  };

  const onSwipeRight = () => {
    if (tabIndex > 0) {
      setSelectedDay(tabs[tabIndex - 1]);
      tabBarRef.current?.scrollToTab?.(tabs[tabIndex - 1]); // scroll tab bar if supported
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    getAvailability();
    setRefreshing(false);
  };

  return (
    <>
      <GestureRecognizer
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
        style={{ flex: 1 }}
      >
        <CustomTabBar
          ref={tabBarRef}
          tabs={tabs}
          activeTab={selectedDay}
          onTabChange={handleTabChange}
          containerStyle={{ backgroundColor: colors.background }}
          tabStyle={{ backgroundColor: colors.surface }}
          activeTabStyle={{ borderBottomColor: colors.primary }}
          textStyle={{ color: colors.text }}
          activeTextStyle={{ color: colors.primary }}
        />
        <FlatList
          data={Slots}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: 60,
            paddingHorizontal: 10,
            backgroundColor: colors.background,
            minHeight: "100%",
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
          ListHeaderComponent={
            <>
              <View style={styles.tabContent}>
                <Text style={styles.dayText}>{selectedDay}</Text>
                <Button
                  mode="outlined"
                  icon="plus"
                  onPress={() => setModalVisible(true)}
                  style={{
                    borderColor: colors.primary,
                    borderWidth: 1,
                    backgroundColor: colors.background,
                  }}
                  labelStyle={{ color: colors.primary }}
                >
                  Add Slot
                </Button>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.noSlotContainer}>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No slots available
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const slotDuration = item.slot_duration || 30;
            const interval = item.slot_interval || 0;
            const start12h = formatTime(convertToMinutes(item.slot_start_time));
            const end12h = formatTime(convertToMinutes(item.slot_end_time));

            const generatedSlots = generateTimeSlots(
              start12h,
              end12h,
              slotDuration,
              interval,
              item.slot_available_type
            );

            return (
              <Card style={styles.slotCard}>
                <Card.Content>
                  <View style={styles.slotHeader}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <MaterialIcons
                        name="access-time"
                        size={18}
                        color="#007AFF"
                        style={{ marginBottom: -2 }}
                      />
                      <Text style={styles.slotTitle}>
                        {start12h} - {end12h}
                      </Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => openEditModal(item)}
                      >
                        <MaterialIcons
                          name="edit-calendar"
                          size={18}
                          color="#007AFF"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.id)}
                      >
                        <MaterialIcons
                          name="delete-outline"
                          size={18}
                          color="#FF0000"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.detailsContainer}>
                    <View style={styles.detailText}>
                      <MaterialIcons
                        name="hourglass-empty"
                        size={24}
                        color="#007AFF"
                      />
                      <View>
                        <Text style={styles.slotLabel}>Slot Duration</Text>
                        <Text style={styles.slotValue}>
                          {item.slot_duration} min
                        </Text>
                      </View>
                    </View>
                    <View style={styles.detailText}>
                      <MaterialIcons name="coffee" size={24} color="#007AFF" />
                      <View>
                        <Text style={styles.slotLabel}>Interval</Text>
                        <Text style={styles.slotValue}>
                          {item.slot_interval} min
                        </Text>
                      </View>
                    </View>
                    <View style={styles.detailText}>
                      <MaterialIcons
                        name="video-call"
                        size={24}
                        color="#007AFF"
                      />
                      <View>
                        <Text style={styles.slotLabel}>Available Type</Text>
                        <Text style={styles.slotValue}>
                          {item.slot_available_type}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.detailText}>
                      <MaterialIcons
                        name="date-range"
                        size={24}
                        color="#007AFF"
                      />
                      <View>
                        <Text style={styles.slotLabel}>Slot Day</Text>
                        <Text style={styles.slotValue}>{item.slot_day}</Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 5,
                    }}
                  >
                    {generatedSlots.length > 0 ? (
                      generatedSlots.map((slot, idx) => (
                        <View key={idx} style={styles.slotDetail}>
                          <Text style={styles.slotTime}>{slot.start}</Text>
                        </View>
                      ))
                    ) : (
                      <View style={styles.noSlotContainer}>
                        <Text style={styles.emptyMessage}>
                          No slots available
                        </Text>
                      </View>
                    )}
                  </View>
                </Card.Content>
              </Card>
            );
          }}
        />
      </GestureRecognizer>
      {/* MODAL - OUTSIDE FLATLIST */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Set Availability for {selectedDay}
            </Text>
            <CustomForm
              fields={fields}
              setFieldValue={setFieldValue}
              isEditing={true}
              handleSave={handleSave}
              handleCancel={handleCancel}
              loading={loading}
              generalError={generalError}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    height: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  timeSlotsContainer: {
    // padding: 8,
    // elevation: 5,
  },
  timeSlotsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noSlotContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "55%",
  },
  emptyText: { fontSize: 18, fontWeight: "bold", opacity: 0.6 },

  slotCard: {
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // marginVertical: 10,
    // // padding: 15,
  },
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  slotTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    margin: 0,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 6,
  },

  detailsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 10,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black", 
    marginBottom: 8,
  },

  detailText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 10,
    gap: 10,
  },
  slotLabel: {
    fontSize: 12,
    color: "gray",
  },
  slotValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#333",
  },
  slotDetail: {
    backgroundColor: "#007AFF",
    borderRadius: 6,
    // marginTop: 5,
  },
  slotTime: {
    fontSize: 12,
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontWeight: 600,
  },
});

export default DoctorAvailability;
