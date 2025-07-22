import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import PatientStories from "./PatientStories";
import PatientStoriesFilter from "./PatientStoriesFileter";

const Stories = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Patient Stories for Dr. K.A. Mohan</Text>
      <PatientStoriesFilter />
      <PatientStories />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
});

export default Stories;
