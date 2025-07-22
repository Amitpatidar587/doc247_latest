import React, { useEffect, useRef, useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import SearchableInput from "../../../components/forms/SearchableInput";
import PhoneInput from "../../../components/forms/PhoneInput";
import CustomTextInput from "../../../components/forms/CustomTextInput";
import { fetchAllPharmacies } from "../../../redux/slices/app_common/AppointmentSlice";

const Pharmacy = ({ formData, onChange, handlePhoneChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPharmacyName, setSelectedPharmacyName] = useState("");
  const debounceTimerRef = useRef(null);
  const dispatch = useDispatch();

  // Redux pharmacy list
  const { pharmacies } = useSelector((state) => state.appointment);

  const pharmacyNames = useMemo(
    () => pharmacies?.map((ph) => ph.first_name),
    [pharmacies]
  );

  // Debounced search
  useEffect(() => {
    if (searchQuery?.length < 1) return;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      const params = {
        search: searchQuery,
        user_type: "pharmacy",
        page_size: 20,
      };
      dispatch(fetchAllPharmacies({ payload: params }));
    }, 500);

    return () => clearTimeout(debounceTimerRef.current);
  }, [searchQuery, dispatch]);

  // Pre-fill selected pharmacy
  useEffect(() => {
    if (formData.pharmacy_name && !selectedPharmacyName) {
      setSelectedPharmacyName(formData.pharmacy_name);
    }

    if (formData.pharmacy_id && pharmacies?.length > 0) {
      const match = pharmacies.find((ph) => ph.id === formData.pharmacy_id);
      if (match) {
        setSelectedPharmacyName(match.first_name);
      }
    }
  }, [
    formData.pharmacy_name,
    formData.pharmacy_id,
    pharmacies,
    selectedPharmacyName,
  ]);

  const handlePharmacyChange = (pharmacyName) => {
    setSelectedPharmacyName(pharmacyName);
    const match = pharmacies?.find((ph) => ph.first_name === pharmacyName);
    onChange("pharmacy_id", match ? match.id : "");
  };

  return (
    <View style={styles.container}>
      <SearchableInput
        label="Search Pharmacy"
        searchArray={pharmacyNames}
        value={selectedPharmacyName}
        setValue={handlePharmacyChange}
        onInputChange={setSearchQuery}
        keyName="name"
      />

      <CustomTextInput
        label="Patient Name"
        value={formData.patient_name ?? ""}
        onChangeText={(text) => onChange("patient_name", text)}
        style={styles.input}
        outlineColor="#ccc"
        activeOutlineColor="#007BFF"
        underlineColor="transparent"
      />

      <PhoneInput
        label="Contact Number"
        defaultValue={{
          contact: formData.patient_contact ?? "",
          country_code: formData.country_code ?? "",
        }}
        onChange={handlePhoneChange}
        style={styles.phoneInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    backgroundColor: "#fff",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  phoneInput: {
    marginTop: 16,
  },
});

export default Pharmacy;
