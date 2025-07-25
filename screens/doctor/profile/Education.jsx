import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import CustomForm from "../../../components/forms/CustomForm";

import CustomButton from "../../../components/forms/CustomButton";
import {
  addEducation,
  deleteEducation,
  fetchEducation,
  resetEducationState,
  updateEducation,
} from "../../../redux/slices/doctor/profile/educationSlice";
import { format, parseISO } from "date-fns";
import { useToast } from "../../../components/utility/Toast";
import { RefreshControl } from "react-native-gesture-handler";

const EducationScreen = () => {
  const { showToast } = useToast();
  const { colors } = useTheme();

  const { userId } = useSelector((state) => state.auth);
  const { educations, loading, error, success, message, fetchloading } =
    useSelector((state) => state.education);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  const dispatch = useDispatch();
  // Fetch Education Data from API

  const getEducation = useCallback(async () => {
    try {
      dispatch(fetchEducation({ doctorId: userId }));
    } catch (error) {
      console.log("Error fetching education:", error);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (message === null) return;
    showToast(message, success ? "success" : "error");

    dispatch(resetEducationState());
    getEducation();
  }, [success, error, message]);

  useEffect(() => {
    getEducation();
  }, [getEducation]);

  const EducationOptions = [
    { label: "Full time", value: "full_time" },
    { label: "Part time", value: "part_time" },
    { label: "Self taught", value: "self_taught" },
  ];

  const fields = [
    {
      name: "institute_name",
      label: "Institution Name",
      type: "text",
      value: editingEducation?.institute_name,
      required: true,
    },
    {
      name: "course",
      label: "Course",
      type: "text",
      value: editingEducation?.course,
      required: true,
    },
    {
      name: "course_start_date",
      label: "Start Date",
      type: "date",
      value: editingEducation?.course_start_date,
      disableFutureDates: true,
      required: true,
    },
    {
      name: "course_end_date",
      label: "End Date",
      type: "date",
      value: editingEducation?.course_end_date,
      minDate: editingEducation?.course_start_date,
      disableFutureDates: true,
      required: true,
    },
    {
      name: "specialization",
      label: "Specialization",
      type: "text",
      value: editingEducation?.specialization,
      required: true,
    },
    {
      name: "degree",
      label: "Degree",
      type: "text",
      value: editingEducation?.degree,
      required: true,
    },
    {
      name: "education_type",
      label: "Education Type",
      type: "select",
      options: EducationOptions,
      value: editingEducation?.education_type,
      required: true,
    },
    {
      name: "country",
      label: "Country",
      type: "text",
      value: editingEducation?.country,
      required: true,
    },
  ];

  // Open Form for Add or Edit
  const openForm = (education = null) => {
    setEditingEducation(
      education || {
        institution: "",
        course: "",
        course_start_date: "",
        course_end_date: "",
        specialization: "",
        degree: "",
        education_type: "",
        country: "",
      }
    );
    setModalVisible(true);
  };

  const closeForm = () => {
    setEditingEducation(null);
    setModalVisible(false);
  };

  // Handle Save for Add or Edit
  const handleSave = async () => {
    try {
      if (editingEducation.id) {
        dispatch(updateEducation({ educationData: editingEducation }));
      } else {
        dispatch(
          addEducation({ doctorId: userId, educationData: editingEducation })
        );
      }
      fetchEducation(); // Refresh the list
      closeForm();
    } catch (error) {
      console.log("Error saving education:", error);
    }
  };

  // Handle Delete
  const handleDeleteEducation = async (id) => {
    try {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to delete this education?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => dispatch(deleteEducation(id)),
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.log("Error deleting education:", error);
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    getEducation();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={educations}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.primary }]}>
                  {item.course ? `${item.course}` : "No Course"}
                </Text>
                <Text style={[styles.title, { color: colors.text }]}>
                  {item.institute_name
                    ? `${item.institute_name}`
                    : "No Institute"}
                </Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>
                  {item.course_start_date && item.course_end_date
                    ? `From: ${
                        item.course_start_date
                          ? format(
                              parseISO(item.course_start_date),
                              "d MMM yyyy"
                            )
                          : ""
                      } -  ${
                        item.course_end_date
                          ? format(parseISO(item.course_end_date), "d MMM yyyy")
                          : ""
                      }`
                    : "No Dates"}
                </Text>

                <Text style={[styles.subtitle, { color: colors.text }]}>
                  {item.specialization
                    ? `Specialization: ${item.specialization}`
                    : "No Specialization"}
                </Text>
              </View>

              {/* Edit & Delete Buttons */}
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() => openForm(item)}
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
                  onPress={() => handleDeleteEducation(item.id)}
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
        ListEmptyComponent={() =>
          loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100%",
                paddingBottom: 60,
                marginTop: "45%",
              }}
            >
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No Education Found
              </Text>
            </View>
          )
        }
      />
      <View style={{ paddingHorizontal: 10 }}>
        <CustomButton title="+ Add Education" onPress={() => openForm()} />
      </View>
      {/* Modal Form */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View
            style={[styles.modalContainer, { backgroundColor: colors.surface }]}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <CustomForm
                fields={fields}
                setFieldValue={(name, value) =>
                  setEditingEducation((prev) => ({ ...prev, [name]: value }))
                }
                handleSave={handleSave}
                handleCancel={closeForm}
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
  container: {
    flex: 1,
    paddingBottom: 70,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  heading: { fontSize: 18, fontWeight: "bold" },
  addButton: { borderRadius: 5 },
  card: {
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold" },
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
  modalContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 20,
    minHeight: "80%",
  },
  scrollContainer: { flexGrow: 1 },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "75%",
  },
  emptyText: { fontSize: 18, fontWeight: "bold", opacity: 0.6 },
});

export default EducationScreen;
