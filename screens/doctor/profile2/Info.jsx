import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Info = () => {
  const images = [
    "https://images1-fabric.practo.com/practices/1138332/dental-de-care-bangalore-64490a0ae4efc.jpg/36x36",
    "https://images1-fabric.practo.com/practices/1138332/dental-de-care-bangalore-64490a013290b.jpg/36x36",
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Clinic Info */}
      <View style={styles.section}>
        <Text style={styles.location}>Domlur, Bangalore</Text>
        <Text style={styles.clinicName}>Dental De Care</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>5.0 </Text>
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              name="star"
              size={14}
              color="#fff"
              style={styles.starIcon}
            />
          ))}
        </View>

        <Text style={styles.address}>
          111, 4th Main, Landmark: Kalki Dhyana Mandir, Bangalore
        </Text>
        <TouchableOpacity>
          <Text style={styles.link}>Get Directions</Text>
        </TouchableOpacity>

        {/* Thumbnails */}
        <View style={styles.imageRow}>
          {images.map((src, i) => (
            <Image
              key={i}
              source={{ uri: src }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ))}
          <View style={styles.moreImages}>
            <Text style={styles.moreText}>+6</Text>
          </View>
        </View>

        {/* Alert/Notice */}
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            Practo forays into Dental care, launches Practo Care Dental. If you
            are a doctor and interested to know more.
            <Text style={styles.link}> Click here</Text>
          </Text>
        </View>
      </View>

      {/* Timing */}
      <View style={styles.section}>
        <Text>
          <Text style={styles.bold}>Mon - Sat</Text>
          {"\n"}10:00 AM - 01:15 PM{"\n"}03:00 PM - 08:00 PM
        </Text>
      </View>

      {/* Fee and Booking */}
      <View style={styles.section}>
        <Text style={styles.fee}>₹500</Text>
        <Text>💳 Online Payment Available</Text>
        <Text style={styles.prime}>
          <Text style={styles.bold}>Prime </Text>
          <Text style={styles.muted}>(✔)</Text>
          {"\n"}
          <Text style={styles.small}>Max. 30 mins wait + Verified details</Text>
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>⚡ Book Appointment</Text>
          <Text style={styles.buttonSubText}>Instant Pay Available</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  section: {
    marginBottom: 20,
  },
  location: {
    color: "#6c757d",
    marginBottom: 4,
  },
  clinicName: {
    fontSize: 18,
    color: "#0d6efd",
    fontWeight: "600",
  },
  ratingTag: {
    backgroundColor: "#198754",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginVertical: 8,
  },
  ratingText: {
    color: "#fff",
    fontWeight: "bold",
  },
  address: {
    marginBottom: 4,
  },
  link: {
    color: "#0d6efd",
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 1,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  moreImages: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: "#f8f9fa",
    borderColor: "#dee2e6",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  moreText: {
    fontSize: 16,
    color: "#495057",
  },
  alertBox: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 4,
    marginTop: 12,
  },
  alertText: {
    fontSize: 14,
    color: "#212529",
  },
  fee: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  prime: {
    marginTop: 8,
    color: "#6f42c1",
  },
  bold: {
    fontWeight: "bold",
  },
  muted: {
    color: "#6c757d",
  },
  small: {
    fontSize: 12,
    color: "#6c757d",
  },
  button: {
    backgroundColor: "#0d6efd",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  buttonSubText: {
    fontSize: 12,
    color: "#e0e0e0",
    textAlign: "center",
  },
  ratingRow: {
    backgroundColor:"green",
    width:120,
    padding:4,
    flexDirection: "row",
    alignItems: "center",
    borderRadius:5,
    marginVertical:3,
  },
  starIcon: {
    marginRight: 4,
  },
});

export default Info;
