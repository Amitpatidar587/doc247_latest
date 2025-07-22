import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";

const ForgotPasswordOverlay = ({ visible, onClose }) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    // Add your password reset logic here
    console.log("Reset password for:", email);
    onClose(); // Close the overlay after handling
  };

  if (!visible) return null; // Don't render if not visible

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Button title="Reset Password" onPress={handleResetPassword} />
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10, // Ensure it is above other components
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "#007BFF",
  },
});

export default ForgotPasswordOverlay;
