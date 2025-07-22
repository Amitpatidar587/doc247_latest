import { FlatList, StyleSheet, Text, View } from "react-native";
import DoctorProfileCard from "./DoctorProfileCard";
import NavLinks from "./Navlinks";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDoctorDetails } from "../../../redux/slices/doctor/doctorSlice";

const DoctorProfile = ({ route }) => {
  const { userId } = route.params;
  const { doctorData } = useSelector((state) => state.doctor);
  const dispatch = useDispatch();

  console.log("doctorData", doctorData);

  useEffect(() => {
    dispatch(fetchDoctorDetails(userId));
  }, [dispatch]);

  if (!doctorData) {
    return <Text>Loading...</Text>;
  }

  const ProfileData = {
    fullname: doctorData.first_name + " " + doctorData.last_name,
    image: doctorData?.profile_image,
    about: doctorData?.about || " ",
    email: doctorData.email,
    speciality:
      doctorData?.speciality ||
      "Orthodontist Dentist Dentofacial Orthopedist Dental Surgeon",
    total_education: doctorData?.total_education,
    total_experience: doctorData?.total_experience,
  };

  return (
    <FlatList
      data={[]}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <View style={styles.container}>
          <View style={styles.cardContainer}>
            <DoctorProfileCard ProfileData={ProfileData} />
          </View>
          <NavLinks data={doctorData} doctorid={userId} />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // backgroundColor: "#fff",
    flex: 1,
    minHeight: "100%",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
});

export default DoctorProfile;
