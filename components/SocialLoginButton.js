import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const SocialLoginButton = ({ platform, onPress }) => {
  return (
    <Button
      mode="outlined"
      onPress={onPress}
      style={styles.button}
      icon={platform.toLowerCase()}
      textColor="#333"
    >
      Continue with {platform}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
});

export default SocialLoginButton;
