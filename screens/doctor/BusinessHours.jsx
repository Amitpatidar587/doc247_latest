import React, { useState } from "react";
import {
  View,
  StyleSheet,
  
  Alert,
} from "react-native";
import {
  Text,
} from "react-native-paper";
import { useSelector } from "react-redux";
import { addAvailability } from "../../api";
import TabbedScreen from "../../components/navigation/TabbedScreen";
import CustomForm from "../../components/forms/CustomForm";

const DoctorAvailability = () => {
  // Sample clinics data - in a real app, this would come from your API or store
  const clinics = [
    { id: 1, name: "Main Clinic" },
    { id: 2, name: "Branch Clinic" },
    { id: 3, name: "Community Health Center" },
  ];

  // Initialize state with empty availability structure
  const [availability, setAvailability] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [clinicDialogVisible, setClinicDialogVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [timeType, setTimeType] = useState(null); // "start" or "end"
  const [editingIndex, setEditingIndex] = useState(null);

  const DAYS = Object.keys(availability);
  const {colors} = useTheme();

  // Function to show time picker modal
  const showTimeModal = (day, index, type) => {
    setSelectedDay(day);
    setTimeType(type);
    setEditingIndex(index);
    setModalVisible(true);
  };

  // Function to hide time picker modal
  const hideTimeModal = () => {
    setModalVisible(false);
  };

  // Function to show clinic selection dialog
  const showClinicDialog = (day, index = null) => {
    setSelectedDay(day);
    setEditingIndex(index);
    setClinicDialogVisible(true);
  };

  // Function to hide clinic selection dialog
  const hideClinicDialog = () => {
    setClinicDialogVisible(false);
  };

  // Function to save selected time
  const saveTime = (formattedTime) => {
    if (selectedDay && timeType) {
      const updatedAvailability = { ...availability };

      // If editing existing slot
      if (editingIndex !== null) {
        updatedAvailability[selectedDay][editingIndex][timeType] =
          formattedTime;
      }
      // If adding a new time slot
      else if (selectedTimeSlot) {
        // This case should never happen but keeping as a safeguard
        selectedTimeSlot[timeType] = formattedTime;
        updatedAvailability[selectedDay].push(selectedTimeSlot);
        setSelectedTimeSlot(null);
      }

      setAvailability(updatedAvailability);
    }
    hideTimeModal();
  };

  // Function to save selected clinic
  const selectClinic = (clinicId) => {
    const selectedClinic = clinics.find((clinic) => clinic.id === clinicId);

    if (selectedDay) {
      const updatedAvailability = { ...availability };

      // If editing existing slot
      if (editingIndex !== null) {
        updatedAvailability[selectedDay][editingIndex].clinic = selectedClinic;
      }
      // If adding a new time slot
      else {
        const newTimeSlot = {
          clinic: selectedClinic,
          start: "09:00 AM",
          end: "05:00 PM",
        };
        updatedAvailability[selectedDay].push(newTimeSlot);
      }

      setAvailability(updatedAvailability);
    }
    hideClinicDialog();
  };

  // Function to add a new availability slot for a day
  const addAvailabilitySlot = (day) => {
    showClinicDialog(day);
  };

  // Function to remove an availability slot
  const removeAvailabilitySlot = (day, index) => {
    Alert.alert(
      "Remove Availability",
      "Are you sure you want to remove this availability slot?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            const updatedAvailability = { ...availability };
            updatedAvailability[day].splice(index, 1);
            setAvailability(updatedAvailability);
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleSetClosed = () => {
    if (selectedDay !== null && editingIndex !== null) {
      const updatedAvailability = { ...availability };
      updatedAvailability[selectedDay][editingIndex] = {
        clinic: updatedAvailability[selectedDay][editingIndex].clinic,
        start: "Closed",
        end: "Closed",
      };
      setAvailability(updatedAvailability);
    }
    hideTimeModal();
  };

  // Get the current time value for selected time slot and time type
  const getCurrentTimeValue = () => {
    if (selectedDay && timeType && editingIndex !== null) {
      return availability[selectedDay][editingIndex][timeType];
    }
    return "09:00 AM"; // Default time
  };

  const handleSave = async () => {
    if (selectedDay === null || editingIndex === null) {
      console.log("No valid availability slot selected.");
      return;
    }

    try {
      const selectedSlot = availability[selectedDay][editingIndex]; // Extract slot safely

      if (!selectedSlot || !selectedSlot.start || !selectedSlot.end) {
        console.log("Invalid availability slot data.");
        return;
      }

      const availabilityData = {
        doctor_id: 1,
        day: selectedDay.toLowerCase(), // API expects lowercase day names
        available_from: selectedSlot.start, // Use extracted slot data
        available_to: selectedSlot.end,
        available_place: selectedSlot.clinic?.name || "Unknown Clinic", // Ensure clinic name is set
      };
      const res = await addAvailability(1, availabilityData);
    } catch (error) {
      console.log("Error saving availability:", error);
    }
  };

  const tabs = [
    {
      name: "Monday",
      component: <Text>Monday</Text>,
    },
    {
      name: "Tuesday",
      component: <Text>Tuesday</Text>,
    },
    {
      name: "Wednesday",
      component: <Text>Wednesday</Text>,
    },
    {
      name: "Thursday",
      component: <Text>Thursday</Text>,
    },
    {
      name: "Friday",
      component: <Text>Friday</Text>,
    },
    {
      name: "Saturday",
      component: <Text>Saturday</Text>,
    },
    {
      name: "Sunday",
      component: <Text>Sunday</Text>,
    },
  ];

  const field = [
    {
      name: "start",
      type: "time",
      label: "Start Time",
      value: getCurrentTimeValue(),
    },
    {
      name: "end",
      type: "time",
      label: "End Time",
      value: getCurrentTimeValue(),
    },

    {
      name: "clinic",
      type: "select",
      label: "Clinic",
      options: clinics.map((clinic) => ({
        value: clinic.id,
        label: clinic.name,
      })),
    },

    {
      name: "duration",
      type: "number",
      label: "Duration",
      value: getCurrentTimeValue(),
    },
    {
      name: "fee",
      type: "number",
      label: "Fee",
      value: getCurrentTimeValue(),
    },

    {
      name: "interval",
      type: "number",
      label: "Interval",
      value: getCurrentTimeValue(),
    },

    {
      name: "available_type",
      type: "select",
      label: "Available Type",
      options: [
        { value: "online", label: "Online" },
        { value: "offline", label: "Offline" },
      ],
    },
  ];

  const renderTabContent = (tab) => {
    return (
      <View style={styles.tabContent}>
        <Text>{tab.name}</Text>
        <CustomForm fields={field} setFieldValue={setFieldValue} />
      </View>
    );
  };

  return (
    // <Surface style={[styles.container, { backgroundColor: colors.surface }]}>
    //   <Text style={[styles.title, { color: colors.text }]}>
    //     Doctor Availability
    //   </Text>

    //   <ScrollView contentContainerStyle={styles.scrollContent}>
    //     {DAYS.map((day) => (
    //       <View
    //         key={day}
    //         style={[styles.daySection, { backgroundColor: colors.surface }]}
    //       >
    //         <View style={styles.dayHeader}>
    //           <Text style={[styles.dayText, { color: colors.text }]}>
    //             {day}
    //           </Text>
    //           <Button
    //             mode="contained"
    //             onPress={() => addAvailabilitySlot(day)}
    //             style={[styles.addButton, { backgroundColor: colors.primary }]}
    //           >
    //             Add Slot
    //           </Button>
    //         </View>

    //         {availability[day].length === 0 ? (
    //           <Text style={[styles.noAvailability, { color: colors.text }]}>
    //             No availability set
    //           </Text>
    //         ) : (
    //           availability[day].map((slot, index) => (
    //             <Surface
    //               key={index}
    //               style={[
    //                 styles.timeSlot,
    //                 { backgroundColor: colors.background },
    //               ]}
    //             >
    //               <View style={styles.clinicInfo}>
    //                 <Text
    //                   style={[styles.clinicName, { color: colors.primary }]}
    //                 >
    //                   {slot.clinic?.name || "Select Clinic"}
    //                 </Text>
    //                 <TouchableOpacity
    //                   onPress={() => showClinicDialog(day, index)}
    //                 >
    //                   <Text
    //                     style={[styles.changeLink, { color: colors.accent }]}
    //                   >
    //                     Change
    //                   </Text>
    //                 </TouchableOpacity>
    //               </View>

    //               <View style={styles.timeButtonsContainer}>
    //                 <TouchableOpacity
    //                   style={[
    //                     styles.timeButton,
    //                     { backgroundColor: colors.primary },
    //                   ]}
    //                   onPress={() => showTimeModal(day, index, "start")}
    //                 >
    //                   <Text
    //                     style={[
    //                       styles.timeText,
    //                       { color: colors.primarybgtext },
    //                     ]}
    //                   >
    //                     {slot.start || "Start Time"}
    //                   </Text>
    //                 </TouchableOpacity>

    //                 <Text style={{ alignSelf: "center", marginHorizontal: 4 }}>
    //                   to
    //                 </Text>

    //                 <TouchableOpacity
    //                   style={[
    //                     styles.timeButton,
    //                     { backgroundColor: colors.primary },
    //                   ]}
    //                   onPress={() => showTimeModal(day, index, "end")}
    //                 >
    //                   <Text
    //                     style={[
    //                       styles.timeText,
    //                       { color: colors.primarybgtext },
    //                     ]}
    //                   >
    //                     {slot.end || "End Time"}
    //                   </Text>
    //                 </TouchableOpacity>

    //                 <IconButton
    //                   icon="delete"
    //                   size={20}
    //                   onPress={() => removeAvailabilitySlot(day, index)}
    //                   style={styles.deleteButton}
    //                 />

    //                <TouchableOpacity
    //                   style={[
    //                     styles.timeButton,
    //                     { backgroundColor: colors.primary },
    //                   ]}
    //                   onPress={() => handleSave()}
    //                 >
    //                   <Text
    //                     style={[
    //                       styles.timeText,
    //                       { color: colors.primarybgtext },
    //                     ]}
    //                   >
    //                     Save
    //                   </Text>
    //                 </TouchableOpacity>
    //               </View>
    //             </Surface>
    //           ))
    //         )}
    //       </View>
    //     ))}
    //   </ScrollView>

    //   {/* Time Picker Modal */}
    //   <TimePickerModal
    //     visible={modalVisible}
    //     onDismiss={hideTimeModal}
    //     onSave={saveTime}
    //     initialTime={getCurrentTimeValue()}
    //     day={selectedDay}
    //     timeType={timeType}
    //     onSetClosed={handleSetClosed}
    //   />

    //   {/* Clinic Selection Dialog */}
    //   <Portal>
    //     <Dialog
    //       visible={clinicDialogVisible}
    //       onDismiss={hideClinicDialog}
    //       style={{ backgroundColor: colors.surface }}
    //     >
    //       <Dialog.Title style={{ color: colors.text }}>
    //         Select Clinic
    //       </Dialog.Title>
    //       <Dialog.Content>
    //         {clinics.map((clinic) => (
    //           <TouchableOpacity
    //             key={clinic.id}
    //             style={[styles.clinicOption, { borderColor: colors.primary }]}
    //             onPress={() => selectClinic(clinic.id)}
    //           >
    //             <Text style={{ color: colors.text }}>{clinic.name}</Text>
    //           </TouchableOpacity>
    //         ))}
    //       </Dialog.Content>
    //       <Dialog.Actions>
    //         <Button onPress={hideClinicDialog}>
    //           <Text style={{ color: colors.primary }}>Cancel</Text>
    //         </Button>
    //       </Dialog.Actions>
    //     </Dialog>
    //   </Portal>
    // </Surface>
    <TabbedScreen tabs={tabs} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  daySection: {
    marginBottom: 20,
    borderRadius: 8,
    elevation: 2,

    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    overflow: "hidden",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    borderRadius: 4,
  },
  noAvailability: {
    padding: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
  timeSlot: {
    padding: 12,
  },
  clinicInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  clinicName: {
    fontWeight: "500",
    fontSize: 15,
  },
  changeLink: {
    fontSize: 12,
    textDecorationLine: "underline",
  },
  timeButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeButton: {
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  deleteButton: {
    marginLeft: 4,
  },
  clinicOption: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 8,
  },
});

export default DoctorAvailability;
