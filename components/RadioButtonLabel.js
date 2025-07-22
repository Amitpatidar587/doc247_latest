import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RadioButtonLabel = ({
  label,
  value,
  selectedValue,
  onValueChange,
  type,
  isAvailable = true, // default to true
}) => {
  const isSelected = selectedValue === value;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected
          ? styles.selectedContainer
          : isAvailable
          ? styles.unselectedContainer
          : styles.disabledContainer,
      ]}
      onPress={() => isAvailable && onValueChange(value)}
      disabled={!isAvailable}
      activeOpacity={isAvailable ? 0.7 : 1} // No opacity feedback when disabled
    >
      <Text
        style={[
          styles.label,
          isSelected && styles.selectedLabel,
          !isAvailable && styles.disabledLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 4,
    gap: 5,
    marginRight: 5,
    maxWidth: 105,
  },
  selectedContainer: {
    borderColor: "#0474ed",
    backgroundColor: "#0474ed",
  },
  unselectedContainer: {
    borderColor: "#e8f0fe",
    backgroundColor: "#e8f0fe",
  },
  disabledContainer: {
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    color: "#0474ed",
    textAlign: "center",
    fontWeight: "500",
  },
  selectedLabel: {
    fontWeight: "bold",
    color: "#fff",
  },
  disabledLabel: {
    color: "#aaa", // Gray text when disabled
  },
});

export default RadioButtonLabel;
