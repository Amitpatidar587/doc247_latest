import React, { useState } from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

const LocationPickerModal = ({ visible, onClose, onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapPress = (event) => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  const confirmLocation = async () => {
    if (!selectedLocation) return;

    const { latitude, longitude } = selectedLocation;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await res.json();

    const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.state ||
      "Unknown";

    onLocationSelect(city);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <MapView
        style={{ flex: 1 }}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 20.5937,
          longitude: 78.9629,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onClose} style={styles.cancel}>
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={confirmLocation} style={styles.confirm}>
          <Text style={styles.text}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default LocationPickerModal;

const styles = StyleSheet.create({
  actions: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  confirm: {
    backgroundColor: "#0474ed",
    padding: 12,
    borderRadius: 8,
  },
  cancel: {
    backgroundColor: "#999",
    padding: 12,
    borderRadius: 8,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
