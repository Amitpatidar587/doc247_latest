import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import doctorData from "../../../doctor.json";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const AwardCard = ({ data }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {data?.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No awards data available.</Text>
        </View>
      )}
      {data?.map((award) => (
        <View key={award.id} style={styles.card}>
          <Text style={styles.title}>
            {award.award_name || "Unnamed Award"}
          </Text>
          <Text style={styles.date}>{formatDate(award.award_date)}</Text>
          {award.award_description ? (
            <Text style={styles.text}>
              <Text style={styles.label}>Description: </Text>
              {award.award_description}
            </Text>
          ) : null}
          {/* <Text style={styles.text}>
            <Text style={styles.label}>Status: </Text>
            <Text style={award.is_active ? styles.active : styles.inactive}>
              {award.is_active ? "Active" : "Inactive"}
            </Text>
          </Text> */}
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
    color: "#0474ed",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
  },
  active: {
    color: "green",
    fontWeight: "bold",
  },
  inactive: {
    color: "#999",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  empty: {
    fontStyle: "italic",
    fontSize: 16,
    color: "#999",
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

export default AwardCard;
