import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SearchableInput from "../../../components/forms/SearchableInput";
import CustomTextInput from "../../../components/forms/CustomTextInput";

const AddDiagnosis = ({ diagnosisList = [], onChange }) => {
  const [error, setError] = useState("");
  const [currentDisease, setCurrentDisease] = useState("");
  const [currentDiagnosis, setCurrentDiagnosis] = useState("");
  const [editIndex, setEditIndex] = useState(null); // Track edit mode

  const predefinedDiseases = [
    "Fever",
    "Headache",
    "Stomach Ache",
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Arthritis",
    "Cancer",
    "Heart Disease",
    "Kidney Disease",
  ];

  // Handle add or update
  const handleSaveDiagnosis = () => {
    if (!currentDisease || !currentDiagnosis) {
      setError("Please enter both disease and diagnosis");
      return;
    }

    const updatedDiagnosis =
      editIndex !== null
        ? diagnosisList.map((item, index) =>
            index === editIndex
              ? {
                  diagnosis_title: currentDisease,
                  diagnosis_description: currentDiagnosis,
                }
              : item
          )
        : [
            ...diagnosisList,
            {
              diagnosis_title: currentDisease,
              diagnosis_description: currentDiagnosis,
            },
          ];

    onChange(updatedDiagnosis);
    setCurrentDisease("");
    setCurrentDiagnosis("");
    setEditIndex(null);
    setError("");
  };

  // Handle delete
  const removeDiagnosis = (index) => {
    onChange(diagnosisList.filter((_, i) => i !== index));
  };

  // Handle edit
  const editDiagnosis = (index) => {
    setCurrentDisease(diagnosisList[index].diagnosis_title);
    setCurrentDiagnosis(diagnosisList[index].diagnosis_description);
    setEditIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Heading */}
      {/* <Text style={styles.title}>Diagnosis</Text> */}

      {/* Header Row */}
      {diagnosisList.length > 0 && (
        <View style={styles.headerRow}>
          <Text style={[styles.headerText, styles.diseaseCol]}>Disease</Text>
          <Text style={[styles.headerText, styles.diagnosisCol]}>
            Diagnosis
          </Text>
          <Text style={[styles.headerText, styles.actionCol]}>Actions</Text>
        </View>
      )}

      {/* Data Rows */}
      {diagnosisList.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={[styles.rowText, styles.diseaseCol]}>
            {item.diagnosis_title}
          </Text>
          <Text style={[styles.rowText, styles.diagnosisCol]}>
            {item.diagnosis_description}
          </Text>
          <View
            style={[styles.rowText, styles.actionCol, styles.actionButtons]}
          >
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => editDiagnosis(index)}
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#007bff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => removeDiagnosis(index)}
            >
              <MaterialCommunityIcons
                name="trash-can"
                size={20}
                color="#dc3545"
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Input Section */}
      <View style={styles.inputRow}>
        <View style={styles.inputCol}>
          {/* 
              If you plan to incorporate a searchable dropdown, 
              ensure your SearchableInput is adapted to RN properly.
          */}
          <SearchableInput
            searchArray={predefinedDiseases}
            value={currentDisease}
            setValue={setCurrentDisease}
            style={styles.textInput}
            // placeholder="Disease"s
            label={"Disease"}
          />
        </View>
        <View style={styles.inputCol}>
          <CustomTextInput
            style={styles.textInput}
            placeholder="Diagnosis"
            label={"Diagnosis"}
            value={currentDiagnosis}
            onChangeText={setCurrentDiagnosis}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleSaveDiagnosis}
        >
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

AddDiagnosis.propTypes = {
  diagnosisList: PropTypes.arrayOf(
    PropTypes.shape({
      diagnosis_title: PropTypes.string.isRequired,
      diagnosis_description: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
    textAlign: "center", // Center the heading text
  },
  headerRow: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 8,
    alignItems: "center",
  },
  headerText: {
    color: "#555",
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  diseaseCol: {
    flex: 3,
    paddingHorizontal: 4,
    textAlign: "left",
  },
  diagnosisCol: {
    flex: 4,
    paddingHorizontal: 4,
    textAlign: "left",
  },
  actionCol: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowText: {
    fontSize: 14,
    textAlign: "center",
    flexWrap: "wrap",
    paddingHorizontal: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  actionButton: {
    marginHorizontal: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  inputCol: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#007bff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#dc3545",
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
  },
});

export default AddDiagnosis;
