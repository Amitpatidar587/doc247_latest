import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Avatar, Card, useTheme } from "react-native-paper";

const PatientReview = ({ data, name }) => {
  // console.log(data);
  const {colors} = useTheme();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Patient Reviews</Text>
        <ScrollView style={styles.container}>
          {data?.map((item) => (
            <Card style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.cardContent}>
                <View style={styles.leftContent}>
                  {item?.reviewer_image ? (
                    <Avatar.Image
                      size={50}
                      source={{ uri: item?.reviewer_image }}
                      style={{ backgroundColor: colors.primary }}
                    />
                  ) : (
                    <Avatar.Text
                      size={50}
                      label={item?.reviewer_name?.[0] || "?"}
                      style={{ backgroundColor: colors.primary }}
                    />
                  )}
                </View>
                <View style={styles.middleContent}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {item?.reviewer_name && (
                      <Text style={[styles.title, { color: colors.text }]}>
                        {item?.reviewer_name}
                      </Text>
                    )}
                    {item?.created_at && (
                      <Text
                        style={{
                          color: "grey",
                          fontSize: 12,
                          fontStyle: "italic",
                        }}
                      >
                        {format(new Date(item?.created_at), "d MMMM yy")}
                      </Text>
                    )}
                  </View>
                  <StarRating rating={item?.rating} />
                  <Text style={[styles.comment, { color: colors.text }]}>
                    {item?.description}
                  </Text>
                </View>
                {/* <View style={styles.iconContainer}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    iconColor={colors.primary}
                    onPress={() => setModalVisible(true)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    iconColor={colors.primary}
                  />
                </View> */}
              </View>
            </Card>
          ))}

          {/* Footer Link */}
          <Text style={styles.footerLink}>
            Show all stories ({data?.length})
          </Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    marginBottom: 20,
  },
  card: {
    borderRadius: 8,
    padding: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  timeText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 18,
    padding: 5,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 8,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  recommendText: {
    fontSize: 14,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eee",
  },
});

export default PatientReview;
