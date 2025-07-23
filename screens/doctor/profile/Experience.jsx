import { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Card, Text, Button, useTheme } from "react-native-paper";
import CustomForm from "../../../components/forms/CustomForm";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator } from "react-native";
import CustomButton from "../../../components/forms/CustomButton";
import {
  addExperience,
  deleteExperience,
  fetchExperiences,
  resetExperienceState,
  updateExperience,
} from "../../../redux/slices/doctor/profile/experienceSlice";
import { useToast } from "../../../components/utility/Toast";
import { RefreshControl } from "react-native-gesture-handler";

const ExperienceScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const { userId } = useSelector((state) => state.auth);

  const { experiences, success, message, loading, error } = useSelector(
    (state) => state.experience
  );
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const { showToast } = useToast();

  const fetchExperience = useCallback(async () => {
    try {
      dispatch(fetchExperiences({ doctorId: userId }));
    } catch (error) {
      console.error("Error fetching experiences:", error);
    }
  }, [dispatch, userId]);
  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  useEffect(() => {
    if (message === null) return;
    showToast(message, success ? "success" : "error");
    dispatch(resetExperienceState());
    fetchExperience();
  }, [success, error, message]);

  const employmentOptios = [
    { label: "Full Time", value: "full_time" },
    { label: "Part Time", value: "part_time" },
    { label: "Self Employed", value: "self_employed" },
  ];

  const fields = [
    {
      name: "hospital_name",
      label: "Hospital Name",
      type: "text",
      value: editingExperience?.hospital_name,
      required: true,
    },
    {
      name: "title",
      label: "Job Title",
      type: "text",
      value: editingExperience?.title,
      required: true,
    },
    {
      name: "employment_type",
      label: "Employment Type",
      type: "select",
      options: employmentOptios,
      value: editingExperience?.employment_type,
      required: true,
    },

    {
      name: "join_date",
      label: "Start Date",
      type: "date",
      value: editingExperience?.join_date,
      disableFutureDates: true,
      required: true,
    },
    {
      name: "last_date",
      label: "End Date",
      type: "date",
      value: editingExperience?.last_date,
      disableFutureDates: true,
      minDate: editingExperience?.join_date,
      disabled: editingExperience?.currently_working,
    },

    {
      name: "location",
      label: "Location",
      type: "text",
      value: editingExperience?.location,
      required: true,
    },
    {
      name: "job_description",
      label: "Job Description",
      type: "text",
      value: editingExperience?.job_description,
      required: true,
    },
    {
      name: "currently_working",
      label: "I am currently working here",
      type: "checkbox",
      value: editingExperience?.currently_working,
    },
  ];

  // console.log(experiences);
  const openForm = (experience = null) => {
    setEditingExperience(
      experience || {
        hospital: "",
        title: "",
        employment_type: "",
        join_date: "",
        last_date: "",
        location: "",
        job_description: "",
        year_of_exp: "",
        currently_working: false,
      }
    );
    setModalVisible(true);
  };

  const closeForm = () => {
    setEditingExperience(null);
    setModalVisible(false);
  };
  const handleSave = async () => {
    try {
      if (editingExperience.id) {
        dispatch(updateExperience({ experienceData: editingExperience }));
        closeForm();
      } else {
        await dispatch(
          addExperience({ doctorId: userId, experienceData: editingExperience })
        );
        closeForm();
      }
    } catch (error) {
      console.error("Error saving experience:", error);
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      Alert.alert(
        "Confirmation",
        "Are you sure you want to delete this experience?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => dispatch(deleteExperience(id)),
          },
        ],
        { cancelable: true }
      );
      fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExperience();
    setRefreshing(false);
  }, [fetchExperience]);

  return (
    <View style={styles.container}>
      <FlatList
        data={experiences}
        style={{ flex: 1, paddingTop: 10 }}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingBottom: 10,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        keyExtractor={(item) => item?.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                {item?.title && item?.hospital_name && (
                  <Text style={styles.title}>
                    {item.title} at {item.hospital_name}
                  </Text>
                )}
                {item?.employment_type &&
                  item?.start_date &&
                  item?.last_date && (
                    <Text style={styles.subtitle}>
                      {item.employment_type} | {item.start_date} -{" "}
                      {item.last_date}
                    </Text>
                  )}
                {item?.location && (
                  <Text
                    style={(styles.location, { textTransform: "capitalize" })}
                  >
                    {item.location}
                  </Text>
                )}
                {item?.job_description && (
                  <Text style={styles.description}>{item.job_description}</Text>
                )}
                {item?.year_of_exp != null &&
                  !isNaN(Number(item?.year_of_exp)) &&
                  typeof item?.year_of_exp !== "object" &&
                  item?.year_of_exp > 0 && (
                    <Text style={styles.subtitle}>
                      {`${Number(item?.year_of_exp).toFixed(
                        1
                      )} years of experience`}
                    </Text>
                  )}
              </View>
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
                  {/* <Ionicons name="pencil" size={24} color="#007bff" /> */}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteExperience(item.id)}
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
              No Experience Found
            </Text>
          </View>
        )}
      />
      <View style={styles.addButton}>
        <CustomButton
          title="+ Add Experience"
          variant="primary-outline"
          size="lg"
          onPress={() => openForm()}
        />
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <CustomForm
              fields={fields}
              setFieldValue={(name, value) =>
                setEditingExperience((prev) => ({ ...prev, [name]: value }))
              }
              isEditing={true}
              handleSave={handleSave}
              handleCancel={closeForm}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  heading: { fontSize: 18, fontWeight: "bold" },
  addButton: {  
    marginHorizontal: 15,
    marginVertical: 5,
  },
  card: {
    marginVertical: 5,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    // elevation: 1,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#555" },
  location: { fontSize: 14, color: "#007bff" },
  description: { fontSize: 14, color: "#333" },
  iconContainer: { flexDirection: "column", alignItems: "center", gap: 10 },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    // elevation: 5,
    height: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "75%",
  },
  emptyText: { fontSize: 18, fontWeight: "bold", opacity: 0.6 },
});

export default ExperienceScreen;
