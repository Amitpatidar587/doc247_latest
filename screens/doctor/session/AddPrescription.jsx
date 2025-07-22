import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import PropTypes from "prop-types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker";
import CustomTextInput from "../../../components/forms/CustomTextInput";

const AddPrescription = ({ prescriptionList = [], onChange }) => {
  const [error, setError] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [currentType, setCurrentType] = useState("");
  const [currentDosage, setCurrentDosage] = useState("");
  const [currentDuration, setCurrentDuration] = useState("");
  const [currentInstruction, setCurrentInstruction] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isOtherMedicine, setIsOtherMedicine] = useState(false);

  const predefinedMedicines = [
    "Paracetamol",
    "Ibuprofen",
    "Amoxicillin",
    "Metformin",
    "Aspirin",
    "Losartan",
    "Atorvastatin",
    "Omeprazole",
    "Levothyroxine",
    "Insulin",
    "Other",
  ];

  const handleSavePrescription = () => {
    // Check if all fields are filled
    const medicineName = isOtherMedicine ? currentName : currentName;

    if (
      !medicineName ||
      !currentDosage ||
      !currentDuration ||
      !currentInstruction
    ) {
      setError("Please enter all fields");
      return;
    }

    const updatedPrescriptions = [...prescriptionList];

    const newPrescription = {
      name: medicineName,
      type: currentType,
      dosage: currentDosage,
      duration: currentDuration,
      instruction: currentInstruction,
    };

    if (editIndex !== null) {
      updatedPrescriptions[editIndex] = newPrescription;
      setEditIndex(null);
    } else {
      updatedPrescriptions.push(newPrescription);
    }

    onChange(updatedPrescriptions);
    resetFields();
    setError("");
  };

  const removePrescription = (index) => {
    onChange(prescriptionList.filter((_, i) => i !== index));
  };

  const editPrescription = (index) => {
    const prescription = prescriptionList[index];
    setCurrentName(prescription.name);
    setCurrentType(prescription.type);
    setCurrentDosage(prescription.dosage);
    setCurrentDuration(prescription.duration);
    setCurrentInstruction(prescription.instruction);
    setEditIndex(index);

    // Check if it's a custom medicine
    const isPredefined = predefinedMedicines.includes(prescription.name);
    setIsOtherMedicine(!isPredefined && prescription.name !== "");
  };

  const resetFields = () => {
    setCurrentName("");
    setCurrentType("");
    setCurrentDosage("");
    setCurrentDuration("");
    setCurrentInstruction("");
    setIsOtherMedicine(false);
  };

  const handleMedicineChange = (value) => {
    if (value === "Other") {
      setIsOtherMedicine(true);
      setCurrentName("");
    } else {
      setIsOtherMedicine(false);
      setCurrentName(value);
    }
  };

  const renderPrescriptionItem = ({ item, index }) => (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 10,
          marginVertical: 5,
        }}
      >
        <View style={{ flex: 1, gap: 5 }}>
          <View>
            <Text style={{ fontSize: 13, fontWeight: "bold" }}>
              {item.name}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13 }}>
                <Text style={{ color: "#a1a1a1" }}>Dosage:</Text> {item.dosage}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13 }}>
                <Text style={{ color: "#a1a1a1" }}>Duration:</Text>{" "}
                {item.duration}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13 }}>{item.instruction}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => editPrescription(index)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              minWidth: 50,
              borderWidth: 1,
              borderColor: "#007bff",
            }}
          >
            <Text
              style={{
                color: "#007bff",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 13,
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => removePrescription(index)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              minWidth: 50,
              borderWidth: 1,
              borderColor: "#007bff",
            }}
          >
            <Text
              style={{
                color: "#dc3545",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 13,
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
    // <View
    //   style={{
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     borderWidth: 1,
    //     borderColor: "#eee",
    //     padding: 16,
    //     borderRadius: 10,
    //     marginBottom: 10,
    //   }}
    // >
    //   <View>
    //     <View>
    //       <Text>{item.name}</Text>
    //     </View>
    //     <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
    //       <Text>{item.dosage}</Text>
    //       <Text>{item.duration}</Text>
    //     </View>
    //     <View>
    //       <Text>{item.instruction}</Text>
    //     </View>
    //   </View>
    //   <View style={{ flexDirection: "column", gap: 5 }}>
    //     <TouchableOpacity
    //       style={{
    //         paddingVertical: 5,
    //         paddingHorizontal: 10,
    //         borderRadius: 10,
    //         borderWidth: 1,
    //         borderColor: "#007bff",
    //         textAlign: "center",
    //       }}
    //     >
    //       <Text
    //         style={{
    //           color: "#007bff",
    //           fontWeight: "bold",
    //           textAlign: "center",
    //         }}
    //       >
    //         Edit
    //       </Text>
    //     </TouchableOpacity>
    //     <TouchableOpacity
    //       style={{
    //         paddingVertical: 5,
    //         paddingHorizontal: 10,
    //         borderRadius: 10,
    //         borderWidth: 1,
    //         borderColor: "#dc3545",
    //         textAlign: "center",
    //       }}
    //     >
    //       <Text
    //         style={{
    //           color: "#dc3545",
    //           fontWeight: "bold",
    //           textAlign: "center",
    //         }}
    //       >
    //         Delete
    //       </Text>
    //     </TouchableOpacity>
    //   </View>
    // </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>Prescription</Text> */}

      {/* Header */}
      {/* <View style={[styles.row, styles.headerRow]}>
        <View style={[styles.cell, styles.nameCell]}>
          <Text style={styles.headerText}>Medicine</Text>
        </View>

        <View style={[styles.cell, styles.dosageCell]}>
          <Text style={styles.headerText}>Dosage</Text>
        </View>
        <View style={[styles.cell, styles.durationCell]}>
          <Text style={styles.headerText}>Duration</Text>
        </View>
        <View style={[styles.cell, styles.instructionCell]}>
          <Text style={styles.headerText}>Instruction</Text>
        </View>
        <View style={[styles.cell, styles.actionCell]}>
          <Text style={styles.headerText}>Actions</Text>
        </View>
      </View> */}

      {/* Prescription List */}
      <FlatList
        data={prescriptionList}
        renderItem={renderPrescriptionItem}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
      />

      {/* Input Row */}
      <View style={styles.inputContainer}>
        <View style={styles.medicineInputContainer}>
          {/* <Picker
              selectedValue={isOtherMedicine ? "Other" : currentName}
              onValueChange={handleMedicineChange}
              style={styles.picker}
            >
              <Picker.Item label="Select Medicine" value="" />
              {predefinedMedicines.map((med, idx) => (
                <Picker.Item key={idx} label={med} value={med} />
              ))}
            </Picker> */}

          {/* {isOtherMedicine && ( */}
          <CustomTextInput
            placeholder="Enter medicine name"
            label={"Medicine"}
            value={currentName}
            onChangeText={setCurrentName}
            style={styles.otherMedicineInput}
          />
          {/* )} */}
        </View>

        {/* <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Visit Type:</Text>
          <Picker
            selectedValue={currentType}
            onValueChange={setCurrentType}
            style={styles.picker}
          >
            <Picker.Item label="Select Type" value="" />
            <Picker.Item label="Video call" value="Video call" />
            <Picker.Item label="Direct Visit" value="Direct Visit" />
          </Picker>
        </View> */}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={[styles.medicineInputContainer, { width: "48%" }]}>
            <CustomTextInput
              style={styles.input}
              placeholder="1-0-1"
              label={"Dosage"}
              value={currentDosage}
              onChangeText={setCurrentDosage}
            />
          </View>

          <View style={(styles.medicineInputContainer, { width: "48%" })}>
            <CustomTextInput
              style={styles.input}
              placeholder="Duration"
              label={"Duration"}
              value={currentDuration}
              onChangeText={setCurrentDuration}
            />
          </View>
        </View>

        <View style={styles.medicineInputContainer}>
          <CustomTextInput
            style={styles.input}
            placeholder="Instruction"
            label={"Instruction"}
            value={currentInstruction}
            onChangeText={setCurrentInstruction}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleSavePrescription}
          >
            <Text style={styles.buttonText}>
              {editIndex !== null ? "Update" : "Add"} Prescription
            </Text>
            <MaterialCommunityIcons
              name={editIndex !== null ? "pencil" : "plus-circle-outline"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ScrollView>
  );
};

AddPrescription.propTypes = {
  prescriptionList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      dosage: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      instruction: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  title: {
    // fontWeight: "600",
    // fontSize: 18,
    // marginBottom: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
    // paddingBottom: 8,
    // textAlign: "center",
    // marginHorizontal: 16,
    // paddingTop: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
    paddingVertical: 5,
    // marginHorizontal: 10,
    marginTop: 10,
  },
  headerRow: {
    // backgroundColor: "#f5f5f5",
    // paddingVertical: 8,
  },
  cell: {
    // padding: 5,
  },
  headerText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "700",
    textAlign: "left",
  },
  cellText: {
    fontSize: 13,
    // textAlign: "center",
  },
  nameCell: {
    flex: 3,
  },
  typeCell: {
    flex: 2,
  },
  dosageCell: {
    flex: 2,
  },
  durationCell: {
    flex: 2,
  },
  instructionCell: {
    flex: 3,
  },
  actionCell: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 5,
  },
  iconButton: {
    marginHorizontal: 4,
    padding: 4,
  },
  inputContainer: {
    // backgroundColor: "#f9f9f9",
    // padding: 16,
    marginTop: 16,
    // borderRadius: 8,
    // marginHorizontal: 10,
    marginBottom: 20,
  },
  inputRow: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  medicineInputContainer: {
    marginBottom: 10,
  },
  otherMedicineInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    // marginTop: 10,
    // backgroundColor: "red",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  addButton: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    marginRight: 6,
  },
  errorText: {
    color: "#dc3545",
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
});

export default AddPrescription;
