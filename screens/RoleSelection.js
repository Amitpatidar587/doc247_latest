import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const RoleSelection = () => {
  const navigation = useNavigation();

  const handleDoctorLogin = () => {
    navigation.navigate("Login", { role: "doctor" });
  };

  const handlePatientLogin = () => {
    navigation.navigate("Login", { role: "patient" });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card} onPress={handleDoctorLogin}>
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons name="stethoscope" size={60} color="#0474ed" />
          <Text style={styles.cardText}>Login as Doctor</Text>
        </Card.Content>
      </Card>
      <Card style={styles.card} onPress={handlePatientLogin}>
        <Card.Content style={styles.cardContent}>
          <FontAwesome name="user-md" size={60} color="#0474ed" />
          <Text style={styles.cardText}>Login as Patient</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  card: {
    marginVertical: 10,
    width: "80%",
    elevation: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  cardContent: {
    flexDirection: "column",
    alignItems: "center",
    padding: 15,
    gap: 15,
  },
  cardText: {
    fontSize: 20,
    color: "#333",
  },
});

export default RoleSelection;
