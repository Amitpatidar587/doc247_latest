import { differenceInYears } from "date-fns";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import doctorImage from "../../../assets/doctor.jpg"; // Import the doctor image
import { selectedDoctor } from "../../../redux/slices/doctor/doctorSlice";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useFriendlyDate } from "../../../components/hooks/dateHook";
import CustomButton from "../../../components/forms/CustomButton.jsx";

export const DoctorCard = ({
  doctor,
  onFavorite,
  onDeleteFavorite,
  hideBookingButton = false,
  isonline,
}) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const formateDate = useFriendlyDate();
  const navigation = useNavigation();
  const convertToHttps = (url) => {
    return url ? url.replace(/^http:\/\//i, "https://") : null;
  };
  const formatExperienceFromYears = (yearsInput) => {
    if (!yearsInput || yearsInput <= 0) {
      return "";
    }
    const totalMonths = Math.round(yearsInput * 12); // Convert to months
    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    let experienceString = "";
    if (years > 0) {
      experienceString += `${years} year${years !== 1 ? "s" : ""}`;
    }
    if (remainingMonths > 0) {
      if (experienceString) {
        experienceString += " ";
      }
      experienceString += `${remainingMonths} month${
        remainingMonths !== 1 ? "s" : ""
      }`;
    }
    return experienceString;
  };
  const calculateAge = (birthDate) => {
    if (!birthDate) {
      return "";
    }
    return differenceInYears(new Date(), new Date(birthDate));
  };

  const handleBooking = async () => {
    dispatch(selectedDoctor(doctor));
    navigation.navigate("BookScreen");
  };

  const handleCall = async () => {
    dispatch(selectedDoctor({ video_call: true, ...doctor }));
    navigation.navigate("BookScreen");
  };

  const isAvailable =
    doctor?.next_available_date && doctor.next_available_date !== "0";
  return (
    <View style={styles.doctordoctor}>
      {/* <Text>{doctor.id}</Text> */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("DoctorProfile", {
            // doctorId: doctor?.doctor_user_id,
            userId: doctor?.id,
          });
        }}
      >
        <View style={styles.doctorImageContainer}>
          <Image
            source={
              doctor?.profile_image?.trim()
                ? { uri: convertToHttps(doctor.profile_image) }
                : doctorImage // directly use the imported local image
            }
            style={styles.doctorImage}
          />
          {/* <View style={styles.favoriteContainer}>
          {doctor?.favorite !== undefined && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() =>
                doctor?.favorite
                  ? onDeleteFavorite(doctor.id)
                  : onFavorite(doctor.id)
              }
            >
              <Icon
                name="heart"
                size={20}
                color={doctor?.favorite ? "red" : "#E0E0E0"}
              />
            </TouchableOpacity>
          )}
        </View> */}
        </View>
      </TouchableOpacity>

      {/* <Image source={doctorImage} style={styles.doctorImage} /> */}
      <View style={styles.doctorInfo}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {doctor?.designation && (
            <Text
              style={[
                styles.designation,
                {
                  color: colors.primary,
                  textTransform: "capitalize",
                  fontWeight: "bold",
                },
              ]}
            >
              {doctor?.designation}
            </Text>
          )}
          {doctor?.average_rating !== null &&
            doctor?.average_rating !== undefined &&
            !isNaN(Number(doctor?.average_rating)) &&
            Number(doctor?.average_rating) > 0 && (
              <View style={styles.detailsRow}>
                <Text style={{}}>
                  {Number(doctor.average_rating).toFixed(1)}
                </Text>
                <Icon name="star" size={16} color="#FFD700" />
              </View>
            )}
        </View>
        {(doctor?.first_name || doctor?.last_name) && (
          <Text style={styles.doctorName}>
            Dr. {doctor.first_name} {doctor.last_name}
          </Text>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            justifyContent: "space-between",
          }}
        >
          {doctor?.gender && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Icon name="gender-male-female" size={16} color="#6c757d" />
              <Text style={{ textTransform: "capitalize" }}>
                {doctor.gender}
              </Text>
            </View>
          )}
          {doctor?.d_of_birth && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Icon name="cake-variant" size={16} color="#6c757d" />
              <Text style={{ textTransform: "capitalize" }}>
                {calculateAge(doctor.d_of_birth)} Years
              </Text>
            </View>
          )}
          {doctor?.total_awards !== null &&
            doctor?.total_awards !== undefined &&
            !isNaN(Number(doctor?.total_awards)) &&
            Number(doctor?.total_awards) > 0 && (
              <View style={styles.detailsRow}>
                <Icon name="trophy-variant" size={16} color="#6c757d" />
                <Text style={{ marginLeft: 2 }}>
                  {Number(doctor.total_awards)}
                </Text>
              </View>
            )}
        </View>

        {doctor?.total_experience > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Icon name="briefcase-outline" size={16} color="#6c757d" />
            <Text style={{ textTransform: "capitalize" }}>
              {formatExperienceFromYears(doctor.total_experience)} Experience
            </Text>
          </View>
        )}

        {(doctor?.address ||
          doctor?.city ||
          doctor?.state ||
          doctor?.country) && (
          <View style={styles.detailsRow}>
            <Icon name="map-marker-outline" size={16} color="#6c757d" />
            <Text style={styles.doctorDetails}>
              {doctor.address}, {doctor.city}
            </Text>
          </View>
        )}
        {doctor?.consultation_fees > 0 && (
          <View style={styles.detailsRow}>
            <Icon name="currency-inr" size={16} color="#6c757d" />
            <Text style={styles.doctorDetails}>
              Fee: {doctor?.consultation_fees}
            </Text>
          </View>
        )}
        {/* {doctor?.next_available_date && ( */}
        {isonline && !!isonline && (
          <View>
            <View style={styles.detailsRow}>
              <Icon
                name="calendar"
                size={16}
                color="#6c757d"
                style={styles.icon}
              />
              <Text
                style={[
                  styles.availabilityContainer,
                  isAvailable ? styles.available : styles.notAvailable,
                ]}
              >
                {isAvailable
                  ? `Available on ${formateDate(doctor.next_available_date)}`
                  : "Not available for next 3 days"}
              </Text>
            </View>
          </View>
        )}

        {/* )} */}

        {/* <View style={styles.detailsRow}>
          <Icon name="currency-usd" size={16} color="#6c757d" />
          <Text style={styles.doctorDetails}>Fee: {doctor.fee}</Text>
        </View> */}

        {isonline && isonline === true ? (
          <View style={styles.detailsRow}>
            <CustomButton
              style={styles.bookButton}
              onPress={() => handleCall(doctor)}
              title={"Call Now"}
            />
          </View>
        ) : (
          !hideBookingButton && (
            <View style={styles.bookButtonContainer}>
              <CustomButton
                style={styles.bookButton}
                onPress={() => handleBooking(doctor)}
                title={"Book Appointment"}
              />
            </View>
          )
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  doctordoctor: {
    flexDirection: "row",
    alignItems: "top",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    // boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 4px",
    flexWrap: "wrap",
  },
  doctorImageContainer: {
    position: "relative",
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  favoriteContainer: {
    position: "absolute",
    top: 2,
    left: 0,
  },

  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  doctorInfo: {
    marginLeft: 10,
    flex: 1,
    gap: 2,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#343a40",
    textTransform: "capitalize",
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#6c757d",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  doctorDetails: {
    fontSize: 12,
    // color: "#adb5bd",
    marginLeft: 4,
  },
  bookButton: {
    marginTop: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: "100%",
    height: "auto",
  },
  bookButtonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },

  availabilityContainer: {
    borderRadius: 6,
    // marginVertical: 10,
  },
  available: {
    color: "#006400",
  },
  notAvailable: {
    color: "red",
  },

  icon: {
    marginRight: 8,
  },
  availabilityText: {
    fontSize: 14,
    textTransform: "capitalize",
    textAlign: "center",
  },
});
