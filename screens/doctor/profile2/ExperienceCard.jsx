import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from 'react-native-paper'
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ExperienceCard = ({ data }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {data?.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No experience data available.</Text>
        </View>
      )}
      {data?.map((exp) => (
        <View style={styles.card} key={exp.id}>
          <Text style={styles.title}>
            {exp.title || "Untitled"} at {exp.hospital_name || "Unknown"}
          </Text>
          <Text style={styles.subtitle}>{exp.location || "Location N/A"}</Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Employment: </Text>
            {exp.employment_type?.replace("_", " ") || "N/A"}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Duration: </Text>
            {formatDate(exp.join_date)} -{" "}
            {exp.currently_working ? "Present" : formatDate(exp.last_date)}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Experience: </Text>
            {exp.year_of_exp?.toFixed(1)} years
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Status: </Text>
            {exp.working_status}
          </Text>
          {exp.job_description ? (
            <Text style={styles.text}>
              <Text style={styles.label}>Role: </Text>
              {exp.job_description}
            </Text>
          ) : null}
          {exp.achievements ? (
            <Text style={styles.text}>
              <Text style={styles.label}>Achievements: </Text>
              {exp.achievements}
            </Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#0474ed",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
  },
  noDataContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#999",
  },
});

export default ExperienceCard;
