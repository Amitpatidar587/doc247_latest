import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import RadioButtonLabel from "../../components/RadioButtonLabel";
import CustomButton from "../../components/forms/CustomButton";

import {
  createAppointment,
  getAvailableSlots,
  resetAppointmentState,
} from "../../redux/slices/app_common/AppointmentSlice";
import { format, addDays, isSaturday, isSunday } from "date-fns";
import { DoctorCard } from "./Home/DoctorCard";
import { useToast } from "../../components/utility/Toast";

const BookAppointmentScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [enteredHealthId, setEnteredHealthId] = useState("");
  const { selectedDoctor } = useSelector((state) => state.doctor);
  const { userId, healthId } = useSelector((state) => state.auth);

  const { colors } = useTheme();
  const { showToast } = useToast();
  const isHealthIdValid =
    healthId || (enteredHealthId && enteredHealthId.length >= 8);
  const {
    availableSlots,
    getAvailableSlotsLoading,
    loading,
    success,
    error,
    message,
  } = useSelector((state) => state.appointment);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [dateOptions, setDateOptions] = useState([]);
  useEffect(() => {
    const options = generateDateOptions();
    setDateOptions(options);
    setSelectedDate(options[0]?.value); // Set Today as default
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (message === null) return;
    showToast(message, success ? "success" : "error");

    dispatch(resetAppointmentState());
    if (success) {
      navigation.navigate("Confirmation", {
        doctor: {
          name: `${selectedDoctor?.first_name} ${selectedDoctor?.last_name}`,
        },
        date: format(new Date(selectedDate), "MMMM d, yyyy"),
        time: format(new Date(`1970-01-01T${selectedTime}`), "h:mm a"),
      });
    }
  }, [success, message, error]);

  const fetchAvailableSlots = async () => {
    try {
      const data = {
        doctor_id: selectedDoctor?.doctor_id || selectedDoctor?.id,
        date: selectedDate,
      };
      await dispatch(getAvailableSlots(data));
    } catch (error) {
      console.error("Failed to fetch slots:", error);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      return Alert.alert("Error", "Please select both a date and a time slot.");
    }

    try {
      const payload = {
        doctor_id: selectedDoctor?.doctor_id || selectedDoctor?.id,
        patient_id: userId,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        visit_type: availableSlots?.slot_available_type,
        appointment_type: availableSlots?.slot_available_type,
      };
      dispatch(createAppointment(payload));
    } catch (error) {
      console.error("Booking error:", error);
      Alert.alert("Booking Failed", error?.message || "Something went wrong.");
    }
  };

  const generateDateOptions = () => {
    const today = new Date();
    const dates = [];
    let validDays = 0;

    for (let i = 0; validDays < 30; i++) {
      const date = addDays(today, i);
      if (isSaturday(date) || isSunday(date)) continue;

      const label =
        i === 0
          ? `Today (${format(date, "dd MMM")})`
          : i === 1
          ? `Tomorrow (${format(date, "dd MMM")})`
          : format(date, "EEEE dd MMM");

      dates.push({ value: format(date, "yyyy-MM-dd"), label });
      validDays++;
    }
    return dates;
  };

  const availableTimeSlots =
    availableSlots?.flatMap((session) =>
      session.slots.map(
        (slot) => (
          // console.log(slot),
          {
            label: format(new Date(`1970-01-01T${slot.start_time}`), "h:mm a"),
            value: slot.start_time,
            isAvailable: slot.is_available,
          }
        )
      )
    ) || [];

  return (
    <ScrollView style={styles.container}>
      <DoctorCard doctor={selectedDoctor} hideBookingButton={true} />
      <View>
        {isHealthIdValid ? (
          <View style={[styles.alertBox, styles.success]}>
            <Text style={[styles.bold, { color: "#28a745" }]}>
              No consultation fee applicable.
            </Text>
          </View>
        ) : (
          <>
            <View style={[styles.alertBox, styles.warning]}>
              <Text style={styles.alertText}>
                <Text style={styles.bold}>Note:</Text> No Health ID found.
                Consultation fee of{"  "}
                <Text style={styles.bold}>
                  ₹{selectedDoctor?.consultation_fees || "N/A"}
                </Text>{" "}
                will be applicable.
              </Text>
            </View>
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dateOptions.map((date) => (
          <RadioButtonLabel
            key={date.value}
            label={date.label}
            value={date.value}
            selectedValue={selectedDate}
            onValueChange={(value) => {
              setSelectedDate(value);
              setSelectedTime(""); // Reset time slot when date changes
            }}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Select Time Slot</Text>
      {getAvailableSlotsLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.timeSlotContainer}>
          {availableTimeSlots?.length > 0 ? (
            availableTimeSlots?.map((slot) => (
              <RadioButtonLabel
                key={slot.value}
                label={slot.label}
                value={slot.value}
                selectedValue={selectedTime}
                onValueChange={(val) => {
                  if (slot.isAvailable) {
                    setSelectedTime(val);
                  }
                }}
                isAvailable={slot.isAvailable}
              />
            ))
          ) : (
            <Text style={styles.noSlotsText}>No Slots Available</Text>
          )}
        </View>
      )}

      {availableTimeSlots?.length > 0 && (
        <CustomButton
          title="Confirm Booking"
          onPress={handleBooking}
          style={{ marginBottom: 100 }}
          loading={loading}
          disabled={!selectedDate || !selectedTime || loading}
          color="#0474ed"
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#333",
  },
  timeSlotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  noSlotsText: {
    fontSize: 16,
    color: "red",
    marginTop: 10,
  },
  alertBox: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
  success: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  warning: {
    backgroundColor: "#fff3cd",
  },
  alertText: {
    fontSize: 14,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
  },
});

export default BookAppointmentScreen;
