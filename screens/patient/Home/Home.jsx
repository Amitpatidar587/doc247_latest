import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DoctorSearchInput from "../../common/DoctorSearchInput";
import {
  resetsearchQuery,
  searchQuery,
} from "../../../redux/slices/doctor/doctorSlice";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
// import { fetchDoctors } from "../../../redux/slices/doctor/doctorSlice";
// import { useDispatch } from "react-redux";

const PatientHome = ({ navigation }) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      setSearch(""); // clear local search input
      dispatch(resetsearchQuery()); // reset redux search
    }, [dispatch])
  );

  const handleSearch = () => {
    console.log("serach button clicked", search);
    dispatch(searchQuery(search));
    navigation.navigate("Search");
  };

  const handleChange = (query) => {
    setSearch(query);
  };

  // Animation on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  // Enhanced specialties with more detailed icons and descriptions
  const specialties = [
    {
      id: 1,
      title: "General Physician",
      icon: <MaterialCommunityIcons style={styles.icon} name="stethoscope" />,
    },
    {
      id: 2,
      title: "Skin & Hair",
      icon: <MaterialCommunityIcons style={styles.icon} name="face-man" />,
    },
    {
      id: 3,
      title: "Women's Health",
      icon: <MaterialCommunityIcons style={styles.icon} name="human-female" />,
    },
    {
      id: 4,
      title: "Dental Care",
      icon: <MaterialCommunityIcons style={styles.icon} name="tooth" />,
    },
    {
      id: 5,
      title: "Child Specialist",
      icon: <MaterialCommunityIcons style={styles.icon} name="baby-face" />,
    },
    {
      id: 6,
      title: "Ear, Nose, Throat",
      icon: <MaterialCommunityIcons style={styles.icon} name="ear-hearing" />,
    },
    {
      id: 7,
      title: "Mental Wellness",
      icon: <MaterialCommunityIcons style={styles.icon} name="brain" />,
    },
    {
      id: 8,
      title: "20+ more",
      icon: (
        <MaterialCommunityIcons style={styles.icon} name="dots-horizontal" />
      ),
    },
  ];

  const procedures = [
    {
      id: 1,
      title: "ENT",
      icon: (
        <MaterialCommunityIcons
          name="ear-hearing"
          style={styles.procedureIcon}
        />
      ),
    },
    {
      id: 2,
      title: "Heart",
      icon: (
        <MaterialCommunityIcons
          name="heart-pulse"
          style={styles.procedureIcon}
        />
      ),
    },
    {
      id: 3,
      title: "Dental",
      icon: (
        <MaterialCommunityIcons name="tooth" style={styles.procedureIcon} />
      ),
    },
    {
      id: 4,
      title: "50+ more",
      icon: (
        <MaterialCommunityIcons
          name="dots-horizontal"
          style={styles.procedureIcon}
        />
      ),
    },
  ];

  const renderConsultationType = (title, icon, color, isonline) => (
    <Animated.View
      style={[
        styles.consultationType,
        {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Search", { isonline })}
      >
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <MaterialCommunityIcons name={icon} size={24} color="white" />
        </View>
        <View style={styles.consultTextContainer}>
          <Text style={styles.consultTitle}>{title}</Text>
          <Icon name="chevron-right" size={24} color={colors.primary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  // const handleLogout = () => {
  //   try{
  //   dispatch(logOut());
  //   navigation.navigate("RoleSelection" );
  // }
  // catch(error){
  //   console.log(error);
  // }
  // }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#0474ed" barStyle="light-content" />
      <ScrollView
        vertical
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        // showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header */}
        {/* <Animated.View
          style={[
            styles.header,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.locationContainer}>
            <Icon name="map-marker" size={24} color="white" />
            <Text style={styles.locationText}>Bangalore</Text>
            <Icon name="chevron-down" size={24} color="white" />
          </View>
          <Searchbar
            placeholder="Search doctors, clinics, hospitals..."
            onChangeText={setSearch}
            value={search}
            style={styles.searchBar}
            iconColor={colors.primary}
            placeholderTextColor="#666"
          />
        </Animated.View> */}

        {/* <TouchableOpacity>
          <Text>
            <MaterialCommunityIcons
              name="account"
              size={50}
              color="blue"
              onPress={handleLogout}
            />
          </Text>
        </TouchableOpacity> */}

        <DoctorSearchInput
          handleSearch={handleSearch}
          handleChange={handleChange}
          search={search}
        />

        {/* Consultation Types with Enhanced Design */}
        <View style={styles.consultationTypes}>
          {renderConsultationType(
            "Find Doctors Near You",
            "hospital-building",
            "#2196F3",
            false
          )}
          {renderConsultationType(
            "Video Consultation",
            "video",
            "#4CAF50",
            true
          )}
        </View>

        {/* Specialties Grid with Animation */}
        <Animated.View
          style={[
            styles.specialtiesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>
            Find a Doctor for your Health Problem
          </Text>
          <View style={styles.specialtiesGrid}>
            {specialties.map((specialty, index) => (
              <TouchableOpacity
                key={specialty.id}
                style={[
                  styles.specialtyItem,
                  { backgroundColor: specialty.color + "15" },
                ]}
                onPress={() =>
                  navigation.navigate("Search", {
                    specialty: specialty.title,
                  })
                }
              >
                <View
                  style={[
                    styles.specialtyIcon,
                    { backgroundColor: specialty.color },
                  ]}
                >
                  {specialty.icon}
                </View>
                <Text style={styles.specialtyText}>{specialty.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Featured Services Section */}
        <Animated.View
          style={[
            styles.specialtiesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Featured services</Text>
          <View style={styles.featuredServices}>
            <Text style={[styles.featuredTitle, { marginBottom: 16 }]}>
              Affordable Procedures by Expert Doctors
            </Text>
            <View style={styles.proceduresGrid}>
              {procedures.map((procedure) => (
                <TouchableOpacity
                  key={procedure.id}
                  style={styles.procedureItem}
                >
                  {/* <Image source={image} style={styles.procedureIcon} /> */}
                  {procedure.icon}
                  <Text style={styles.procedureText}>{procedure.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* <View style={styles.insuranceInfo}>
              <Text style={styles.insuranceText}>All insurances accepted</Text>
              <Text style={styles.insuranceText}>& No Cost EMI available</Text>
              <TouchableOpacity style={styles.estimateButton}>
                <Text style={styles.estimateButtonText}>Get Cost Estimate</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </Animated.View>
        {/* Enhanced Promo Cards */}
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.promoContainer}
        >
          <TouchableOpacity style={styles.promoCard}>
            <Image
              source={
                <MaterialCommunityIcons name="stethoscope" color="#0474ed" />
              }
              style={styles.promoImage}
            />
            <Text style={styles.promoTitle}>Best-quality treatments</Text>
            <Text style={styles.promoSubtitle}>using advanced techniques</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.promoCard}>
            <Image
              source={
                <MaterialCommunityIcons name="stethoscope" color="#0474ed" />
              }
              style={styles.promoImage}
            />
            <Text style={styles.promoTitle}>Safe & Precise LASIK</Text>
            <Text style={styles.promoSubtitle}>
              Freedom from glasses forever in just 30min
            </Text>
            <Text style={styles.promoAction}>Book Consultation Now</Text>
          </TouchableOpacity>
        </ScrollView> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 30,
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
    scrollEnabled: true,
  },
  header: {
    backgroundColor: "#0474ed",
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  searchBar: {
    borderRadius: 10,
    marginTop: 12,
    elevation: 2,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  locationText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  consultationTypes: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  consultationType: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
    elevation: 10,
    boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.15)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  consultTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  consultTitle: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  specialtiesSection: {
    padding: 16,
  },
  specialtiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  specialtyItem: {
    width: "23%",
    aspectRatio: 1,
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "start",
    marginBottom: 16,
    // boxShadow: "0px 0px 1px rgba(0, 0, 0, 0.15)",
  },
  specialtyIcon: {
    // padding: 8,
    borderRadius: 8,
    // marginBottom: 4,
  },
  icon: {
    color: "#0474ed",
    fontSize: 36,
  },
  specialtyText: {
    textAlign: "center",
    // marginTop: 4,
    fontSize: 12,
  },
  featuredServices: {
    backgroundColor: "#f0f0ff",
    padding: 16,
    marginVertical: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    // fontWeight: "bold",
    // marginBottom: 16,
  },
  proceduresGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "1%",
  },
  procedureItem: {
    alignItems: "center",
    justifyContent: "start",
    width: "23%",
    // backgroundColor: "white",
    // borderRadius: 5,
    // padding: 10,
    elevation: 2,
    // boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.15)",
    marginBottom: 10,
  },
  procedureIcon: {
    // width: "100%",
    // height: 60,
    fontSize: 36,
    // borderRadius: 8,
    marginBottom: 5,
    color: "#0474ed",
  },
  procedureText: {
    textAlign: "center",
    fontSize: 12,
  },
  insuranceInfo: {
    marginTop: 16,
    alignItems: "center",
  },
  insuranceText: {
    color: "#333",
    fontSize: 12,
    textAlign: "center",
  },
  estimateButton: {
    backgroundColor: "#0474ed",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  estimateButtonText: {
    color: "white",
    fontSize: 14,
  },
  promoContainer: {
    padding: 16,
  },
  promoCard: {
    width: 280,
    backgroundColor: "#f0f0ff",
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
  },
  promoImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  promoSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  promoAction: {
    color: "#0474ed",
    fontSize: 14,
    marginTop: 8,
  },
});

export default PatientHome;
