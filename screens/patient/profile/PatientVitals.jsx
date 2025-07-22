import { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVitals,
  createVital,
  updateVital,
  deleteVital,
  resetVitalsState,
} from "../../../redux/slices/patient/profile/vitalsSlice";
import { format } from "date-fns";
import CustomTextInput from "../../../components/forms/CustomTextInput";
import { useTheme } from "react-native-paper";
import CustomButton from "../../../components/forms/CustomButton";
import { useToast } from "../../../components/utility/Toast";

const vitalFields = [
  { name: "temperature", label: "Temperature", unit: "°C" },
  { name: "pulse", label: "Pulse", unit: "bpm" },
  { name: "respiratory_rate", label: "Respiratory Rate", unit: "bpm" },
  { name: "spo2", label: "SpO2", unit: "%" },
  { name: "waist", label: "Waist", unit: "cm" },
  { name: "bsa", label: "BSA", unit: "m²" },
  { name: "height", label: "Height", unit: "cm" },
  { name: "weight", label: "Weight", unit: "kg" },
  { name: "bmitake", label: "BMI", unit: "kg/m²", readOnly: true },
];

const initialFormData = vitalFields.reduce((acc, field) => {
  acc[field.name] = "";
  return acc;
}, {});

const PatientVitals = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { vitals, message, success, loading } = useSelector(
    (state) => state.vital
  );
  const { colors } = useTheme();
  const { showToast } = useToast();

  const [formData, setFormData] = useState(initialFormData);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const getVitals = useCallback(() => {
    dispatch(fetchVitals({ patient_id: userId }));
  }, [dispatch, userId]);

  useEffect(() => {
    getVitals();
  }, [getVitals]);

  useEffect(() => {
    const height = parseFloat(formData.height) || 0;
    const weight = parseFloat(formData.weight) || 0;
    if (height > 0 && weight > 0) {
      const bmi = (weight / (height / 100) ** 2).toFixed(2);
      setFormData((prev) => ({ ...prev, bmitake: bmi }));
    }
  }, [formData.height, formData.weight]);

  const openModal = (vital = null) => {
    if (vital) {
      const populated = vitalFields.reduce((acc, { name }) => {
        acc[name] =
          vital[name] !== null && vital[name] !== undefined
            ? String(vital[name])
            : "";
        return acc;
      }, {});
      setFormData(populated);
      setEditId(vital.id);
    } else {
      setFormData(initialFormData);
      setEditId(null);
    }
    setErrors({});
    setModalVisible(true);
  };

  const validateForm = () => {
    const newErrors = {};
    vitalFields.forEach((field) => {
      if (!field.readOnly && String(formData[field.name]).trim() === "") {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSave = () => {
    if (!validateForm()) return;
    if (editId) {
      dispatch(updateVital({ vitalData: formData, id: editId }));
    } else {
      dispatch(createVital({ vitalData: formData, patient_id: userId }));
    }
    setFormData(initialFormData);
    setEditId(null);
  };

  const handleDelete = (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(deleteVital(id)),
      },
    ]);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getVitals();
    setRefreshing(false);
  };

  useEffect(() => {
    if (message === null) return;
    showToast(message, success ? "success" : "error");
    if (success) {
      setModalVisible(false);
      getVitals();
    }
    dispatch(resetVitalsState());
  }, [message, success, dispatch, getVitals]);

  const renderVitalsItem = ({ item }) => (
    <View key={item.id} style={styles.fieldsContainer}>
      <Text style={styles.timestamp}>
        Recorded on: {format(item.created_at, "dd MMM yyyy")}
      </Text>
      <View style={styles.vitalGrid}>
        {vitalFields.map(({ name, label, unit }) => (
          <View key={name} style={styles.displayRow}>
            <Text style={styles.displayLabel}>{label}:</Text>
            <Text style={styles.displayValue}>
              {item[name] ? `${item[name]} ${unit}` : "N/A"}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => openModal(item)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
      ]}
    >
      {vitals?.length === 0 ? (
        <View style={styles.noVitals}>
          <Text style={styles.noVitalsText}>No vitals found.</Text>
        </View>
      ) : (
        <FlatList
          data={vitals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderVitalsItem}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={{
            padding: 15,
            flex: 1,
            minHeight: "100%",
          }}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addButtonText}>Add New Vitals</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editId ? "Edit Vitals" : "Add Vitals"}
            </Text>
            <FlatList
              data={vitalFields}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <View key={item.name} style={styles.inputGroup}>
                  <CustomTextInput
                    keyboardType="numeric"
                    editable={!item.readOnly}
                    value={formData[item.name]}
                    onChangeText={(text) => handleInputChange(item.name, text)}
                    label={item.label}
                  />
                  {errors[item.name] && (
                    <Text style={styles.errorText}>{errors[item.name]}</Text>
                  )}
                </View>
              )}
            />
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Save"
                onPress={handleSave}
                style={styles.saveButton}
                loading={loading}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    // flex: 1,
    minHeight: "100%",
    paddingBottom: 60,
  },
  fieldsContainer: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timestamp: {
    color: "#666",
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "right",
    marginBottom: 8,
  },
  vitalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    columnGap: 10,
  },
  displayRow: {
    minWidth: "28%",
  },
  displayLabel: { color: "#666", fontSize: 12 },
  displayValue: { color: "#000", fontSize: 16, fontWeight: "bold" },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  editButtonText: { color: "#007BFF", fontWeight: "bold" },
  deleteButtonText: { color: "red", fontWeight: "bold" },
  addButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    margin: 10,
    backgroundColor: "#fff",
  },
  addButtonText: { color: "#007BFF", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    maxHeight: "90%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  inputGroup: { marginBottom: 10 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 10,
  },
  saveButton: {
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    minWidth: 150,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    maxHeight: 50,
    maxWidth: 150,
  },
  cancelText: { textAlign: "center", color: "#777" },
  errorText: { color: "red", marginTop: 5 },
  noVitals: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    // paddingBottom: 80,
  },
  noVitalsText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    fontWeight: "bold",
  },
});

export default PatientVitals;
