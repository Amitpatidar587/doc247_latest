import React from "react";
import { SafeAreaView, StyleSheet, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const VideosCall = () => {
  const navigation = useNavigation();
  const { userRole } = useSelector((state) => state.auth);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        {userRole === "patient" ? (
          <Button
            title="Patient Video Call"
            onPress={() => navigation.navigate("DoctorVideo")}
          />
        ) : (
          <Button
            title="Doctor Video Call"
            onPress={() => navigation.navigate("DoctorVideo")}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "80%",
    gap: 20,
  },
});

export default VideosCall;
