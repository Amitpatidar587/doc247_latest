import React, {  useEffect, useRef } from "react";
import {  StyleSheet, Animated } from "react-native";
import {  Searchbar, useTheme } from "react-native-paper";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

import useGeolocation from "../../components/hooks/useLiveLocation";

const DoctorSearchInput = ({ handleSearch, handleChange, search }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const getCurrentPosition = useGeolocation();

  console.log(getCurrentPosition);

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
  }, [ fadeAnim, slideAnim, scaleAnim ]);

  const { colors } = useTheme();

  return (
    <Animated.View
      style={[
        styles.header,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      {/* <View style={styles.locationContainer}>
        <Icon name="map-marker" size={24} color="white" />
        <Text style={styles.locationText}>Bangalore</Text>
        <Icon name="chevron-down" size={24} color="white" />
      </View> */}
      <Searchbar
        placeholder="Search doctors, clinics, hospitals..."
        onChangeText={handleChange}
        onSubmitEditing={handleSearch}
        // onIconPress={handleSearch}
        value={search}
        style={styles.searchBar}
        iconColor={colors.primary}
        placeholderTextColor="#666"
      />
    </Animated.View>
  );
};

export default DoctorSearchInput;

const styles = StyleSheet.create({
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
});
