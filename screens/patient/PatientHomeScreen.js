import React, { use, useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import DoctorCard from "../../components/cards/DoctorCard";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { getUserById, getUsers } from "../../api";
import { useSelector } from "react-redux";
import { ActivityIndicator } from "react-native-paper";
import { TextInput } from "react-native-gesture-handler";
import CustomTextInput from "../../components/forms/CustomTextInput";
import DoctorProfile from "../DoctorProfile";
import { fetchDoctors } from "../../redux/slices/doctor/doctorSlice";

const PatientHomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // const userRole = useSelector((state) => state.auth.userRole);
  const [search, setSearch] = useState("");

  // const { userData } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);

  const { doctorsList, loading, error } = useSelector((state) => state.doctor);

  console.log("theme", theme);

  // console.log("doctorsList", doctorsList);

  // Filter doctors whenever usersData updates

  const fetchDoctorsList = async () => {
    try {
      dispatch(fetchDoctors({ search: search }));
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctorsList();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          title="Loading..."
        />
      </View>
    );
  }

  if (error) {
    console.log("Something went wrong error", error);
    return (
      <View>
        <Text style={{ padding: 10 }}>
          Something went wrong, Please try later
        </Text>
      </View>
    );
  } else {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* <CustomTextInput
        mode="flat"
        placeholder="Search"
        value={search}
        onChangeText={(text) => setSearch(text)}
        style={{ marginBottom: 5 }}
      /> */}
        <TextInput
          placeholder={"Search"}
          value={search}
          onChangeText={(text) => setSearch(text)}
          style={{
            marginBottom: 5,
            paddingVertical: 10,
            paddingHorizontal: 15,
            fontSize: 16,
            borderBottomColor: theme.colors.primary,
            borderBottomWidth: 1,
            marginLeft: 10,
            marginRight: 10,
            color: theme.colors.text,
          }}
          mode="outlined"
          theme={{
            colors: {
              primary: "#0474ed",
              underlineColor: "transparent",
              textColor: "#fff",
            },
            borderRadius: 10,
          }}
          selectionColor="#0474ed"
          activeOutlineColor="#0474ed"
          placeholderTextColor={theme.colors.text}
        />
        <FlatList
          data={doctorsList}
          keyExtractor={(item) => item.id}
          style={{ marginBottom: 70 }}
          renderItem={({ item }) => (
            <DoctorCard
              doctor={item}
              // onSelectDoctor={() => dispatch(setDoctorData(item))}
              navigation={navigation}
              hideBookingButton={false}
            />
          )}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 0,
  },
});

export default PatientHomeScreen;

// import React from 'react'
// import { Text } from 'react-native'
// import { View } from 'react-native'

// const PatientHomeScreen = () => {
//   return (
//     <View>
//       <Text>hello</Text>
//     </View>
//   )
// }

// export default PatientHomeScreen
