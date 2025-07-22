import React from "react";
import { Text, StyleSheet } from "react-native";

const AppName = () => {
  return <Text style={styles.appName}>DOC247</Text>;
};

const styles = StyleSheet.create({
  appName: {
    fontSize: 32, // Adjust the size as needed
    fontWeight: "bold",
    color: "#0474ed", // Use the specified color
    textAlign: "center",
    marginVertical: 20, // Add some vertical margin
  },
});

export default AppName;
