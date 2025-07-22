import React, { useEffect } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import PropTypes from "prop-types";
import CustomTextInput from "../../../components/forms/CustomTextInput";

const Vitals = ({ vitals = {}, onChange }) => {
  // Handler: converts the change in TextInput (string) to our onChange update.
  const handleInputChange = (name, value) => {
    // Optionally, you can parse the value as a number if needed:
    // const numericValue = parseFloat(value);
    // onChange({ ...vitals, [name]: isNaN(numericValue) ? value : numericValue });
    onChange({ ...vitals, [name]: value });
  };

  const vitalFields = [
    { name: "temperature", label: "Temperature (°C)" },
    { name: "pulse", label: "Pulse (bpm)" },
    { name: "respiratory_rate", label: "Respiratory Rate" },
    { name: "spo2", label: "SpO2 (%)" },
    { name: "height", label: "Height (cm)" },
    { name: "weight", label: "Weight (kg)" },
    { name: "waist", label: "Waist (cm)" },
    { name: "bsa", label: "BSA (m²)" },
    { name: "bmitake", label: "BMI (kg/m²)", readOnly: true },
  ];

  // Calculate BMI and update only if it has changed.
  useEffect(() => {
    const heightInMeters = vitals.height ? vitals.height / 100 : 0;
    const weight = vitals.weight || 0;

    if (heightInMeters > 0 && weight > 0) {
      const bmi = parseFloat(
        (weight / (heightInMeters * heightInMeters)).toFixed(2)
      );
      if (bmi !== vitals.bmitake) {
        onChange({ ...vitals, bmitake: bmi });
      }
    }
  }, [vitals.height, vitals.weight]);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Vitals</Text> */}
      <View style={styles.fieldsContainer}>
        {vitalFields.map(({ name, label, readOnly }) => (
          <View key={name} style={styles.field}>
            {/* <Text style={styles.label}>{label}</Text> */}
            <CustomTextInput
              style={[styles.input, readOnly && styles.readOnlyInput]}
              keyboardType="numeric"
              value={vitals[name] !== undefined ? String(vitals[name]) : ""}
              onChangeText={(text) => handleInputChange(name, text)}
              editable={!readOnly}
              // placeholder={label}
              label={label}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

Vitals.propTypes = {
  vitals: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 6,
  },
  // title: {
  //   fontWeight: "600",
  //   fontSize: 18,
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#ccc",
  //   paddingBottom: 8,
  //   // marginTop: 20,
  //   marginBottom: 10,
  // },
  fieldsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  field: {
    width: "50%",
    padding: 2,
  },
  label: {
    fontSize: 14,
    // color: "#555",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
  },
  readOnlyInput: {
    backgroundColor: "#f0f0f0",
  },
});

export default Vitals;
