import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

const PatientStories = () => {
  return (
    <ScrollView style={styles.container}>
      {reviews?.map((review) => (
        <View key={review.id} style={styles.card}>
          {/* Header Row */}
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Image
                  source={{ uri: review.reviewer_image }}
                  style={styles.profileImage}
                />
              </View>
              <View>
                <Text style={styles.nameText}>{review.reviewer_name}</Text>
                <Text style={styles.recommendText}>
                  👍 I recommend the doctor
                </Text>
              </View>
            </View>
            <Text style={styles.timeText}>
              {review.created_at.slice(0, 10)}
            </Text>
          </View>

          {/* Happy With Tags */}
          {review.happyWith && (
            <View style={styles.happyWithContainer}>
              <Text style={styles.happyWithLabel}>Happy with:</Text>
              <View style={styles.badgeContainer}>
                {review.happyWith.map((badge, idx) => (
                  <Text key={idx} style={styles.badge}>
                    {badge}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Review Text */}
          <Text style={styles.reviewText}>{review.description}</Text>
        </View>
      ))}

      {/* Footer Link */}
      <Text style={styles.footerLink}>Show all stories (63)</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  card: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#A3C635",
    fontWeight: "bold",
  },
  nameText: {
    fontWeight: "600",
  },
  recommendText: {
    color: "green",
    marginTop: 2,
    fontSize: 12,
  },
  timeText: {
    color: "#6c757d",
    fontSize: 12,
  },
  happyWithContainer: {
    marginTop: 8,
  },
  happyWithLabel: {
    fontWeight: "600",
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  badge: {
    borderWidth: 1,
    borderColor: "#17a2b8",
    color: "#17a2b8",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
    fontSize: 12,
  },
  reviewText: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  footerLink: {
    color: "#007bff",
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 16,
  },
  avatar: {
    flexDirection: "row",
    marginBottom: 12,
  },
});

export default PatientStories;
