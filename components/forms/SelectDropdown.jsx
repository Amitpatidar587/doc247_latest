import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { MultiSelectDropdown } from "react-native-paper-dropdown";
import { Provider as PaperProvider } from "react-native-paper";

const MULTI_SELECT_OPTIONS = [
  { label: "White", value: "white" },
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Orange", value: "orange" },
];

const screenWidth = Dimensions.get("window").width;

export default function SelectDropdown() {
  const [colors, setColors] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
      <View style={styles.container}>
        <MultiSelectDropdown
          label="Colors"
          placeholder="Select Colors"
          options={MULTI_SELECT_OPTIONS}
          value={colors}
          onSelect={setColors}
          visible={showDropdown}
          setVisible={setShowDropdown}
          mode="outlined"
          dropdownContainerStyle={styles.dropdownContainer}
          dropdownStyle={styles.dropdown}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    zIndex: 10, // important if nested inside scrollables or other layers
  },
  dropdownContainer: {
    maxHeight: 200, // limit height to prevent going off-screen
    backgroundColor: "#fff",
    elevation: 5,
    borderRadius: 6,
    overflow: "hidden",
  },
  dropdown: {
    width: screenWidth - 32, // screen width minus margins
  },
});
