import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { TextInput, Button, Text, Surface, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

const screenWidth = Dimensions.get("window").width;

const CustomDatePicker = ({
  label,
  value,
  onDateChange,
  icon = "calendar",
  disableFutureDates = false,
  disablePastDates = false,
  disabled = false,
  minDate = null, // 👈 new prop
}) => {
  const { theme } = useSelector((state) => state.theme);
  const today = new Date();
  const parsedMinDate = minDate ? new Date(minDate) : null;
  const initialDate = value ? new Date(value) : new Date();
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    initialDate.getMonth() + 1
  );
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleDateConfirm = () => {
    const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(
      2,
      "0"
    )}-${String(selectedDay).padStart(2, "0")}`;
    onDateChange(formattedDate);
    hideDatePicker();
  };

  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

  // Generate valid years based on restrictions
  const currentYear = today.getFullYear();
  let minYear = parsedMinDate
    ? parsedMinDate.getFullYear()
    : disablePastDates
    ? currentYear
    : currentYear - 50;
  let maxYear = disableFutureDates ? currentYear : currentYear + 50;
  let validYears = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );

    // Prevent invalid days
  let maxDays = getDaysInMonth(selectedYear, selectedMonth);
  let validDays = Array.from({ length: maxDays }, (_, i) => i + 1);
  if (selectedYear === currentYear && selectedMonth === today.getMonth() + 1) {
    if (disablePastDates)
      validDays = validDays.filter((d) => d >= today.getDate());
    if (disableFutureDates)
      validDays = validDays.filter((d) => d <= today.getDate());
  }

  // Prevent invalid months (if selected year is the current year)
  let validMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  if (selectedYear === currentYear) {
    if (disablePastDates)
      validMonths = validMonths.filter((m) => m >= today.getMonth() + 1);
    if (parsedMinDate && selectedYear === parsedMinDate.getFullYear()) {
      validMonths = validMonths.filter(
        (m) => m >= parsedMinDate.getMonth() + 1
      );
    }

    if (disableFutureDates)
      validMonths = validMonths.filter((m) => m <= today.getMonth() + 1);
  }
  if (
    parsedMinDate &&
    selectedYear === parsedMinDate.getFullYear() &&
    selectedMonth === parsedMinDate.getMonth() + 1
  ) {
    validDays = validDays.filter((d) => d >= parsedMinDate.getDate());
  }



  useEffect(() => {
    if (parsedMinDate) {
      const selectedDate = new Date(
        selectedYear,
        selectedMonth - 1,
        selectedDay
      );
      if (selectedDate < parsedMinDate) {
        setSelectedYear(parsedMinDate.getFullYear());
        setSelectedMonth(parsedMinDate.getMonth() + 1);
        setSelectedDay(parsedMinDate.getDate());
      }
    }
  }, []);

  return (
    <View>
      <TouchableOpacity
        onPress={!disabled ? showDatePicker : null}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <TextInput
          label={label}
          value={value}
          editable={false}
          mode="outlined"
          right={
            <TextInput.Icon
              icon={icon}
              onPress={!disabled ? showDatePicker : undefined}
              forceTextInputFocus={false} // prevents keyboard from showing
            />
          }
          style={[
            styles.input,
            {
              backgroundColor: disabled ? "#e0e0e0" : theme.colors.surface,
            },
          ]}
        />
      </TouchableOpacity>

      {/* Modal for Date Picker */}
      <Modal
        visible={datePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={hideDatePicker}
      >
        <View style={styles.datePickerOverlay}>
          <Surface
            style={[
              styles.datePickerSurface,
              { backgroundColor: theme.colors.surface },
            ]}
            elevation={5}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Select Date
            </Text>

            <View style={styles.datePickerContainer}>
              {/* Year Picker */}
              <View
                style={[
                  styles.pickerColumn,
                  {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
              >
                <Text
                  style={[styles.pickerLabel, { color: theme.colors.text }]}
                >
                  Year
                </Text>
                <ScrollView
                  style={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {validYears.map((year) => (
                    <TouchableOpacity
                      key={year}
                      onPress={() => setSelectedYear(year)}
                      style={[
                        styles.pickerItem,
                        selectedYear === year && {
                          backgroundColor: theme.colors.primary + "20",
                          borderColor: theme.colors.primary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          selectedYear === year && {
                            color: theme.colors.primary,
                            fontWeight: "bold",
                          },
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Month Picker */}
              <View
                style={[
                  styles.pickerColumn,
                  {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
              >
                <Text
                  style={[styles.pickerLabel, { color: theme.colors.text }]}
                >
                  Month
                </Text>
                <ScrollView
                  style={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {validMonths.map((month) => (
                    <TouchableOpacity
                      key={month}
                      onPress={() => setSelectedMonth(month)}
                      style={[
                        styles.pickerItem,
                        selectedMonth === month && {
                          backgroundColor: theme.colors.primary + "20",
                          borderColor: theme.colors.primary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          selectedMonth === month && {
                            color: theme.colors.primary,
                            fontWeight: "bold",
                          },
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Day Picker */}
              <View
                style={[
                  styles.pickerColumn,
                  {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
              >
                <Text
                  style={[styles.pickerLabel, { color: theme.colors.text }]}
                >
                  Day
                </Text>
                <ScrollView
                  style={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {validDays.map((day) => (
                    <TouchableOpacity
                      key={day}
                      onPress={() => setSelectedDay(day)}
                      style={[
                        styles.pickerItem,
                        selectedDay === day && {
                          backgroundColor: theme.colors.primary + "20",
                          borderColor: theme.colors.primary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          { color: theme.colors.text },
                          selectedDay === day && {
                            fontWeight: "bold",
                            color: theme.colors.primary,
                          },
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.datePickerButtons}>
              <Button
                mode="outlined"
                onPress={hideDatePicker}
                style={{ borderColor: theme.colors.primary }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleDateConfirm}
                style={{ backgroundColor: theme.colors.primary }}
              >
                Confirm
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: { marginBottom: 10 },
  datePickerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  datePickerSurface: {
    padding: 20,
    borderRadius: 10,
    width: screenWidth * 0.85,
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  pickerColumn: {
    alignItems: "center",
    width: "31%",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    elevation: 1,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    width: "100%",
    textAlign: "center",
  },
  pickerItem: {
    padding: 0,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  scrollContainer: { height: 200, width: "100%" },
  pickerText: {
    fontSize: 18,
    padding: 5,
    margin: 2,
    borderRadius: 5,
    textAlign: "center",
  },
  datePickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
});

export default CustomDatePicker;
