import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  Card,
  Text,
  Button,
  useTheme,
  Avatar,
  ActivityIndicator,
} from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  addReview,
  fetchReviews,
  resetReview,
  updateReview,
} from "../redux/slices/app_common/utility/ReviewSlice";
import { format } from "date-fns";
import { useToast } from "./utility/Toast";
import { RefreshControl } from "react-native-gesture-handler";
import CustomButton from "./forms/CustomButton.jsx";

const StarRating = ({ rating, onChange = () => {} }) => (
  <View style={styles.ratingContainer}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity key={star} onPress={() => onChange(star)}>
        <MaterialIcons
          name={star <= rating ? "star" : "star-outline"}
          size={24}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      </TouchableOpacity>
    ))}
  </View>
);

const Reviews = ({ targetId, targetType, userRolePass }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { userRole, userId } = useSelector((state) => state.auth);
  const { reviews, fetchloading, success, message, pagination, loading } =
    useSelector((state) => state.review);

  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    rating: 1,
    description: "",
  });

  const getReviewData = useCallback(() => {
    const params = {
      targetId: targetId || userId || "",
      targetType: targetType || userRole || "",
      page: page,
      page_size: 10,
      append: page > 1,
    };
    dispatch(fetchReviews(params));
  }, [dispatch, userId, userRole, targetId, targetType, page]);

  useEffect(() => {
    getReviewData();
  }, [page, getReviewData]);

  useEffect(() => {
    if (message) {
      showToast(message, success ? "success" : "error");
      dispatch(resetReview());

      if (success) {
        setModalVisible(false);
        setFormData({ id: "", rating: 1, description: "" });
        setPage(1); // refresh data
      }
    }
  }, [success, message, dispatch, showToast]);

  const handleSubmitReview = () => {
    const reviewData = {
      rating: formData.rating,
      description: formData.description,
      reviewer_id: userId,
      reviewer_type: userRole,
      target_id: targetId,
      target_type: targetType,
    };

    if (formData.id) {
      dispatch(updateReview({ id: formData.id, reviewData }));
    } else {
      dispatch(addReview(reviewData));
    }
  };

  const renderReview = ({ item }) => (
    <View style={styles.card}>
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
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={[styles.title, { color: colors.text }]}>
                {item?.reviewer_name}
              </Text>
              <Text
                style={{ color: "grey", fontSize: 12, fontStyle: "italic" }}
              >
                {format(new Date(item?.created_at), "d MMMM yy")}
              </Text>
            </View>
            <StarRating rating={item?.rating} />
            <Text style={[styles.comment, { color: colors.text }]}>
              {item?.description}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );

  const uniqueReviews = Array.from(
    new Map(reviews.map((item) => [item.id, item])).values()
  );

  const onRefresh = () => {
    setRefreshing(true);
    getReviewData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={uniqueReviews}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : `key-${index}`
        }
        renderItem={renderReview}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (
            !fetchloading &&
            pagination?.current_page < pagination?.total_pages
          ) {
            setPage((p) => p + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          fetchloading ? <ActivityIndicator style={{ margin: 10 }} /> : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No reviews yet.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 15 }}
      />

      {userRole === "patient" && (
        <View style={{ marginTop: 20, paddingBottom: 20 }}>
          <CustomButton
            onPress={() => setModalVisible(true)}
            title={"+   Add Review"}
          />
        </View>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add Your Review
            </Text>
            <StarRating
              rating={formData.rating}
              onChange={(rating) =>
                setFormData((prev) => ({ ...prev, rating }))
              }
            />
            <TextInput
              placeholder="Write your review..."
              style={[
                styles.input,
                styles.textArea,
                { borderColor: colors.primary, color: colors.text },
              ]}
              multiline
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
              placeholderTextColor={colors.text}
            />
            <View style={[styles.buttonContainer, { width: "100%" }]}>
              <CustomButton
                onPress={handleSubmitReview}
                title="Submit"
                loading={loading}
                size="md"
                style={{ width: "50%" }}
              />
              <CustomButton
                onPress={() => setModalVisible(false)}
                title="Cancel"
                size="md"
                style={{ width: "50%" }}
                variant="danger"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { marginVertical: 2, borderRadius: 10 },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 10,
  },
  leftContent: { marginRight: 10 },
  middleContent: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold" },
  comment: { fontSize: 14 },
  ratingContainer: { flexDirection: "row", marginVertical: 4 },
  noReviewsContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: 40,
  },
  noReviewsText: { fontSize: 16, color: "grey" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    minWidth: "100%",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "90%",
  },
  emptyText: { fontSize: 18, fontWeight: "bold", opacity: 0.6 },
});

export default Reviews;
