import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import { useSelector } from "react-redux";

const screenWidth = Dimensions.get("window").width;

const TimePickerModal = ({
  label,
  value,
  onTimeChange,
  icon = "clock-outline",
  disabled = false,
  minTime = null, // Add minTime support
}) => {
  const { theme } = useSelector((state) => state.theme);

  const initialTime = value ? value.match(/(\d+):(\d+)\s(AM|PM)/) : null;
  const [selectedHour, setSelectedHour] = useState(
    initialTime ? parseInt(initialTime[1], 10) : 9
  );
  const [selectedMinute, setSelectedMinute] = useState(
    initialTime ? parseInt(initialTime[2], 10) : 0
  );
  const [period, setPeriod] = useState(initialTime ? initialTime[3] : "AM");
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const showTimePicker = () => setTimePickerVisible(true);
  const hideTimePicker = () => setTimePickerVisible(false);

  const handleTimeConfirm = () => {
    const formattedTime = `${selectedHour
      .toString()
      .padStart(2, "0")}:${selectedMinute
      .toString()
      .padStart(2, "0")} ${period}`;
    onTimeChange(formattedTime);
    hideTimePicker();
  };

  const to24Hour = (hour, minute, period) => {
    let h = parseInt(hour, 10);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + parseInt(minute, 10);
  };

  const getMinTotalMinutes = () => {
    if (!minTime) return null;
    const [, h, m, p] = minTime.match(/(\d+):(\d+)\s(AM|PM)/);
    return to24Hour(h, m, p);
  };

  const minTotalMinutes = getMinTotalMinutes();

  return (
    <View>
      <TouchableOpacity
        onPress={!disabled ? showTimePicker : null}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <TextInput
          label={label}
          value={value}
          editable={false}
          style={[
            styles.input,
            { backgroundColor: disabled ? "#e0e0e0" : theme.colors.surface },
          ]}
          mode="outlined"
          right={
            <TextInput.Icon
              icon={icon}
              onPress={!disabled ? showTimePicker : undefined}
              forceTextInputFocus={false} // prevents keyboard from showing
            />
          }
        />
      </TouchableOpacity>

      <Modal
        visible={timePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={hideTimePicker}
      >
        <View style={styles.timePickerOverlay}>
          <Surface
            style={[
              styles.timePickerSurface,
              { backgroundColor: theme.colors.surface },
            ]}
            elevation={5}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Select Time
            </Text>

            <View style={styles.timePickerContainer}>
              {/* Hour Picker */}
              <View
                style={[
                  styles.pickerColumn,
                  { backgroundColor: theme.colors.surface },
                  { borderColor: theme.colors.primary },
                ]}
              >
                <Text
                  style={[styles.pickerLabel, { color: theme.colors.text }]}
                >
                  Hour
                </Text>
                <ScrollView
                  style={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {[...Array(12)].map((_, h) => {
                    const hourValue = h + 1;
                    const isDisabled =
                      minTotalMinutes !== null &&
                      to24Hour(hourValue, selectedMinute, period) <
                        minTotalMinutes;
                    return (
                      <TouchableOpacity
                        key={hourValue}
                        onPress={() =>
                          !isDisabled && setSelectedHour(hourValue)
                        }
                        disabled={isDisabled}
                        style={[
                          styles.pickerItem,
                          selectedHour === hourValue &&
                            !isDisabled && {
                              backgroundColor: theme.colors.primary + "20",
                              borderColor: theme.colors.primary,
                            },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pickerText,
                            isDisabled && { color: "#aaa" },
                            selectedHour === hourValue &&
                              !isDisabled && {
                                color: theme.colors.primary,
                                fontWeight: "bold",
                              },
                          ]}
                        >
                          {hourValue.toString().padStart(2, "0")}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Minute Picker */}
              <View
                style={[
                  styles.pickerColumn,
                  { backgroundColor: theme.colors.surface },
                  { borderColor: theme.colors.primary },
                ]}
              >
                <Text
                  style={[styles.pickerLabel, { color: theme.colors.text }]}
                >
                  Minute
                </Text>
                <ScrollView
                  style={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {[0, 15, 30, 45].map((m) => {
                    const isDisabled =
                      minTotalMinutes !== null &&
                      to24Hour(selectedHour, m, period) < minTotalMinutes;
                    return (
                      <TouchableOpacity
                        key={m}
                        onPress={() => !isDisabled && setSelectedMinute(m)}
                        disabled={isDisabled}
                        style={[
                          styles.pickerItem,
                          selectedMinute === m &&
                            !isDisabled && {
                              backgroundColor: theme.colors.primary + "20",
                              borderColor: theme.colors.primary,
                            },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pickerText,
                            isDisabled && { color: "#aaa" },
                            selectedMinute === m &&
                              !isDisabled && {
                                color: theme.colors.primary,
                                fontWeight: "bold",
                              },
                          ]}
                        >
                          {m.toString().padStart(2, "0")}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* AM/PM Picker */}
              <View
                style={[
                  styles.pickerColumn,
                  { backgroundColor: theme.colors.surface },
                  { borderColor: theme.colors.primary },
                ]}
              >
                <Text
                  style={[styles.pickerLabel, { color: theme.colors.text }]}
                >
                  AM/PM
                </Text>
                <ScrollView
                  style={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                >
                  {["AM", "PM"].map((p) => {
                    const isDisabled =
                      minTotalMinutes !== null &&
                      to24Hour(selectedHour, selectedMinute, p) <
                        minTotalMinutes;
                    return (
                      <TouchableOpacity
                        key={p}
                        onPress={() => !isDisabled && setPeriod(p)}
                        disabled={isDisabled}
                        style={[
                          styles.pickerItem,
                          period === p &&
                            !isDisabled && {
                              backgroundColor: theme.colors.primary + "20",
                              borderColor: theme.colors.primary,
                            },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pickerText,
                            isDisabled && { color: "#aaa" },
                            period === p &&
                              !isDisabled && {
                                color: theme.colors.primary,
                                fontWeight: "bold",
                              },
                          ]}
                        >
                          {p}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            <View style={styles.timePickerButtons}>
              <Button mode="outlined" onPress={hideTimePicker}>
                Cancel
              </Button>
              <Button mode="contained" onPress={handleTimeConfirm}>
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
  input: { marginBottom: 16 },
  timePickerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  timePickerSurface: {
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
  timePickerContainer: {
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
  timePickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
});

export default TimePickerModal;
