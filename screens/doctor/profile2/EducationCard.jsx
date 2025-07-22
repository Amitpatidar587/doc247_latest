import { View, Text, StyleSheet, ScrollView } from "react-native";
// import doctorData from "../../doctor.json";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const EducationCard = ({ data }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {data?.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No education data available.</Text>
        </View>
      )}
      {data?.map((edu) => (
        <View key={edu.id} style={styles.card}>
          <Text style={styles.title}>
            {edu.degree || "N/A"} - {edu.course || "N/A"}
          </Text>
          <Text style={styles.subtitle}>
            {edu.institute_name || "Unknown Institute"}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Duration: </Text>
            {formatDate(edu.course_start_date)} -{" "}
            {formatDate(edu.course_end_date)}
          </Text>
          {edu.specialization && (
            <Text style={styles.text}>
              <Text style={styles.label}>Specialization: </Text>
              {edu.specialization}
            </Text>
          )}
          {edu.country && (
            <Text style={styles.text}>
              <Text style={styles.label}>Country: </Text>
              {edu.country}
            </Text>
          )}
          {edu.education_type && (
            <Text style={styles.text}>
              <Text style={styles.label}>Type: </Text>
              {edu.education_type.replace("_", " ")}
            </Text>
          )}
          {edu.certifications && (
            <Text style={styles.text}>
              <Text style={styles.label}>Certification: </Text>
              {edu.certifications}
            </Text>
          )}
          {edu.passing_year && (
            <Text style={styles.text}>
              <Text style={styles.label}>Passing Year: </Text>
              {edu.passing_year}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default EducationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
    color: "#0474ed",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  text: {
    fontSize: 13,
    color: "#333",
    marginBottom: 2,
  },
  label: {
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  error: {
    color: "red",
    padding: 16,
    fontSize: 14,
  },
  info: {
    color: "#555",
    padding: 16,
    fontSize: 14,
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
