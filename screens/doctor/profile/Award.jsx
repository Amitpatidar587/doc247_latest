import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Card, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { format, parseISO } from "date-fns";

import CustomForm from "../../../components/forms/CustomForm";
import CustomButton from "../../../components/forms/CustomButton";

import {
  fetchAwards,
  addAward,
  updateAward,
  deleteAward,
  resetSuccess,
} from "../../../redux/slices/doctor/profile/awardsSlice";
import { useToast } from "../../../components/utility/Toast";
import { RefreshControl } from "react-native-gesture-handler";

const Award = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { showToast } = useToast();
  const { userId } = useSelector((state) => state.auth);
  const { awards, loading, success, message, error } = useSelector(
    (state) => state.award
  );
  const colors = theme.colors;
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAward, setCurrentAward] = useState(null);

  const fields = [
    {
      name: "award_name",
      label: "Award Name",
      type: "text",
      value: currentAward?.award_name,
      required: true,
    },
    {
      name: "award_date",
      label: "Award Date",
      type: "date",
      value: currentAward?.award_date,
      disableFutureDates: true,
      required: true,
    },
    {
      name: "award_description",
      label: "Description",
      type: "text",
      value: currentAward?.award_description,
      required: true,
    },
  ];

  const getAwards = useCallback(async () => {
    await dispatch(fetchAwards({ doctor_id: userId }));
  }, [dispatch, userId]);

  useEffect(() => {
    if (awards?.length > 0) return;
    getAwards();
  }, [getAwards]);

  useEffect(() => {
    if (message === null) return;
    showToast(message, success ? "success" : "error");
    if (success) {
      closeModal();
      getAwards();
    }
    dispatch(resetSuccess());
  }, [success, error, message]);
  const openModal = (award = null) => {
    setCurrentAward(
      award || {
        award_name: "",
        award_date: "",
        award_description: "",
      }
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentAward(null);
  };

  const handleSave = () => {
    try {
      if (currentAward.id) {
        dispatch(updateAward({ id: currentAward.id, award: currentAward }));
      } else {
        dispatch(addAward({ doctor_id: userId, ...currentAward }));
      }
    } catch (error) {
      console.error("Error saving award:", error);
    }
  };

  const handleDelete = (id) => {
    try {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to delete this award?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => dispatch(deleteAward(id)),
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error("Error deleting award:", error);
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getAwards();
    setRefreshing(false);
  }, [getAwards]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* <View style={styles.header}>
        <Text style={[styles.heading, { color: colors.text }]}>Awards</Text>
      </View> */}

      <FlatList
        data={awards}
        style={styles.list}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.text }]}>
                  {item.award_name}
                </Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>
                  {item.award_date
                    ? format(parseISO(item.award_date), "d MMM yyyy")
                    : ""}
                </Text>
                <Text style={[styles.description, { color: colors.text }]}>
                  {item.award_description}
                </Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() => openModal(item)}
                  style={[
                    styles.icon,
                    {
                      borderWidth: 1,
                      borderColor: "#007bff",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 20,
                      minWidth: 70,
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text style={{ color: "#007bff", fontWeight: 700 }}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={[
                    styles.icon,
                    {
                      borderWidth: 1,
                      borderColor: "red",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 20,
                      minWidth: 70,
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text style={{ color: "red", fontWeight: 700 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No Awards Found
            </Text>
          </View>
        )}
      />
      <View style={{ padding: 5, paddingHorizontal: 15 }}>
        <CustomButton title="+ Add Award" onPress={() => openModal()} />
      </View>
      {/* Modal for Add/Edit Award */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View
            style={[styles.modalContainer, { backgroundColor: colors.surface }]}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <CustomForm
                fields={fields}
                setFieldValue={(name, value) =>
                  setCurrentAward((prev) => ({ ...prev, [name]: value }))
                }
                handleSave={handleSave}
                handleCancel={closeModal}
                loading={loading}
                isEditing={true}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 10,
  },
  heading: { fontSize: 18, fontWeight: "bold" },
  card: { marginVertical: 5, padding: 15, borderRadius: 10 },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  subtitle: { fontSize: 14 },
  description: { fontSize: 14, marginTop: 5 },
  iconContainer: { flexDirection: "column", alignItems: "center", gap: 10 },
  icon: { padding: 5 },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: { width: "90%", borderRadius: 10, padding: 20 },
  scrollContainer: { flexGrow: 1 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "75%",
  },
  emptyText: { fontSize: 18, fontWeight: "bold", opacity: 0.6 },
});

export default Award;
