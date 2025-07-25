import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
const DoctorProfileCard = ({ ProfileData }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Profile Section */}
        <View style={styles.profileRow}>
          {ProfileData?.image ? (
            <Image
              source={{ uri: ProfileData?.image }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, styles.initialsContainer]}>
              <Text style={styles.initialsText}>
                {ProfileData?.fullname?.[0]?.toUpperCase() || "?"}
              </Text>
            </View>
          )}

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{ProfileData.fullname} </Text>
            {/* <Text style={styles.subtext}>Profile is claimed</Text> */}
            <Text style={styles.qualifications}>
              {ProfileData?.total_education.map((degree, index) => (
                <Text key={index}>{degree || "N/A"} </Text>
              ))}
            </Text>
            <Text style={styles.specialties}>
              {ProfileData?.speciality ||
                "Orthodontist Dentist Dentofacial Orthopedist Dental Surgeon"}
            </Text>
            <Text style={styles.experience}>
              {Math.floor(ProfileData?.total_experience)} Years Experience
              Overall
              {/* <Text style={styles.smallText}>(15 years as specialist)</Text> */}
            </Text>
          </View>
        </View>

        {/* Clinic Tagline */}
        {/* <View style={styles.taglineRow}>
          <Image
            source={{
              uri: "https://in.pinterest.com/pin/194640015140135615/",
            }}
            accessibilityLabel="Logo"
            style={styles.logo}
          />
          <Text style={styles.tagline}>Trusted Care. Lasting Smiles.</Text>
        </View> */}

        {/* Verification
        <View style={styles.row}>
          <TickIcon
            name="check-circle"
            size={16}
            color="green"
            style={styles.icon}
          />
          <Text style={styles.verifiedText}>Medical Registration Verified</Text>
        </View> */}

        {/* Likes */}
        {/* <View style={styles.row}>
          <ThumbsUpIcon
            name="thumbs-up"
            size={16}
            color="green"
            style={styles.icon}
          />
          <Text style={styles.likesText}>97%</Text>
          <Text style={styles.subtext}> (63 patients)</Text>
        </View> */}

        {/* Description */}
        {/* <Text style={styles.description}>
          Dr. K.A Mohan is a Dentist and Orthodontist in Domlur 2nd Stage,
          Indiranagar, Bangalore and has an experience of 47 years in these
          fields. Dr. K.A Mohan practices at Dental DeCare, Indiranagar &
          Koramangala 3 Block, Bangalore. He completed BDS from Govt. Dental
          College and Research Institute, Bangalore in 1969 and MDS -
          Orthodontics & Dentofacial Orthopaedics from the same institute in
          1977.
        </Text> */}

        {/* <Text style={styles.description}>
          He is a member of Karnataka State Dental Council, Indian Orthodontic
          Society and Indian Dental Association.
        </Text> */}

        {/* Call to Action */}
        {/* <TouchableOpacity
          onPress={() => Linking.openURL("#")}
          style={styles.link}
        >
          <Text style={styles.linkText}>Share your story</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 12,
    // elevation: 3,
  },
  profileRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginRight: 16,
    marginLeft: 10,
    marginTop: 10,
  },

  initialsContainer: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginRight: 16,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#fff",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  qualifications: {
    fontSize: 14,
    marginTop: 6,
  },
  specialties: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
  experience: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  smallText: {
    fontSize: 12,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  tagline: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  icon: {
    marginRight: 6,
  },
  verifiedText: {
    fontSize: 13,
    color: "#333",
  },
  likesText: {
    fontSize: 14,
    fontWeight: "700",
    color: "green",
  },
  description: {
    fontSize: 13,
    color: "#444",
    marginTop: 8,
  },
  link: {
    alignSelf: "flex-end",
    marginTop: 12,
  },
  linkText: {
    color: "#007bff",
    fontSize: 14,
  },
});
export default DoctorProfileCard;
