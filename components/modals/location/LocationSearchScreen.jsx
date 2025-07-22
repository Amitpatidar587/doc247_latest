import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import LocationPickerModal from "./LocationPickerModal";

const LocationSearchScreen = () => {
  const [location, setLocation] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const handleLocationSelect = async (coords) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
      );
      const data = await response.json();
      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.county ||
        "";
      setLocation(city || `${coords.latitude}, ${coords.longitude}`);
    } catch {
      setLocation(`${coords.latitude}, ${coords.longitude}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Search Doctor by Location</Text>

      <TextInput
        style={styles.input}
        value={location}
        placeholder="Enter or select location"
        onChangeText={setLocation}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Open Map Picker</Text>
      </TouchableOpacity>

      <LocationPickerModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onLocationSelect={handleLocationSelect}
      />
    </View>
  );
};

export default LocationSearchScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: "white",
    flex: 1,
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});
