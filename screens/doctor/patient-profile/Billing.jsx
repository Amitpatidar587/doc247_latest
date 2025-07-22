import { View, Text, StyleSheet } from "react-native";

const Billing = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Billing</Text>
    </View>
  );
};

export default Billing;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
