import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Alert } from "react-native";
import {
  Surface,
  Avatar,
  Text,
  IconButton,
  Button,
  useTheme,
} from "react-native-paper";
import { useDispatch } from "react-redux";
import ImagePickerComponent from "./utility/ImagePicker";
import { updateDoctor } from "../redux/slices/doctor/doctorSlice";
import { UpdatePatientDetails } from "../redux/slices/patient/patientSlice";
import { useToast } from "./utility/Toast";

const ProfileCard = ({ userData, containerStyle = {} }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  // start with whatever they already had
  const [selectedImage, setSelectedImage] = useState(
    userData?.profile_image || ""
  );
  useEffect(() => {
    if (userData?.profile_image) {
      setSelectedImage(userData.profile_image);
    }
  }, [userData?.profile_image]);

  const pickerRef = useRef();
  const { showToast } = useToast();
  const firstName = userData?.first_name || "";
  const lastName = userData?.last_name || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  // ensure https so Android won’t block it
  const uri = selectedImage?.startsWith("http://")
    ? selectedImage.replace(/^http:\/\//i, "https://")
    : selectedImage;
  const handleImageSelected = (uri) => {
    setSelectedImage(uri);
  };
  const uploadImage = async () => {
    try {
      if (!selectedImage) {
        return Alert.alert("No image", "Please pick one first");
      }

      const formData = new FormData();
      formData.append("profile_image", {
        uri: selectedImage,
        type: "image/jpeg",
        name: "profile.jpg",
      });

      if (userData.user_type === "patient") {
        const res = await dispatch(
          UpdatePatientDetails({ id: userData.id, patientData: formData })
        ).unwrap();
        if (res.message === null) {
          return;
        }
        showToast(res.message, res.success ? "success" : "error");
      } else {
        const res = await dispatch(
          updateDoctor({ id: userData.id, doctorData: formData })
        ).unwrap();
        if (res.message === null) {
          return;
        }
        showToast(res.message, res.success ? "success" : "error");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
      return null;
    }
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  return (
    <Surface style={[styles.card, containerStyle]}>
      {/* Image */}
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() => pickerRef.current.openPicker()}
          style={{ position: "relative" }}
        >
          {uri ? (
            <Image
              source={{ uri }}
              style={[styles.profileImage, { borderColor: colors.primary }]}
            />
          ) : (
            <Avatar.Text
              size={80}
              label={initials}
              style={[styles.avatar, { backgroundColor: colors.primary }]}
              color="#fff"
            />
          )}
          <View style={[styles.editIcon, { backgroundColor: colors.primary }]}>
            <IconButton icon="camera" size={16} iconColor="#fff" />
          </View>
          {typeof selectedImage === "string" &&
            !selectedImage.startsWith("https://") && (
              <Button
                mode="contained"
                onPress={uploadImage}
                style={styles.uploadButton}
              >
                Upload
              </Button>
            )}
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.info}>
          {(userData?.first_name || userData?.last_name) && (
            <Text style={styles.name}>
              {`${userData?.first_name ?? ""} ${
                userData?.last_name ?? ""
              }`.trim()}
            </Text>
          )}

          {userData?.gender && (
            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              {userData?.gender && (
                <Text
                  style={{
                    textTransform: "capitalize",
                  }}
                >
                  {userData?.gender}
                </Text>
              )}
              {userData?.date_of_birth && (
                <Text
                  style={{
                    textTransform: "capitalize",
                  }}
                >
                  {calculateAge(userData?.date_of_birth)} years
                </Text>
              )}
            </View>
          )}
          {userData?.designation && (
            <Text style={[styles?.email, { textTransform: "capitalize" }]}>
              {userData?.designation}
            </Text>
          )}
          {userData?.email && (
            <Text style={styles.email}>{userData?.email}</Text>
          )}
          {userData?.contact && (
            <Text style={styles.email}>{userData?.contact}</Text>
          )}
          {/* <Text style={styles.email}>
            {userData?.address}, {userData?.city}, {userData?.state},
            {userData?.country}, {userData?.postal_code}
          </Text> */}
        </View>
      </View>

      {/* Picker (invisible) */}
      <ImagePickerComponent
        ref={pickerRef}
        onImageSelected={handleImageSelected}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    padding: 16,
    width: "100%",
    backgroundColor: "#fff",
    // margin: 8,
  },

  logoutButton: {
    // position: "absolute",
    // right: -20,
    // top: -20,
  },
  imageContainer: {
    alignItems: "top",
    justifyContent: "left",
    // marginBottom: 16,
    flexDirection: "row",
    width: "100%",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 3,
    // borderColor: "#fff",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  uploadButton: {
    marginTop: 8,
  },
  info: {
    // flex: 1,
    // alignItems: "flex-start",
    paddingHorizontal: 12,
    // paddingBottom: 24,
    // maxWidth: "calc(100% - 200px)",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    // marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
    maxWidth: "100%",
  },
});

export default ProfileCard;
