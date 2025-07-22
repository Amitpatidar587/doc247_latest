import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { useSelector } from "react-redux";

const CustomButton = ({
  title,
  onPress,
  textColor = "#fff",
  style,
  loading = false,
  disabled = false,
}) => {
  const { theme } = useSelector((state) => state.theme);
  const colors = theme.colors;

  return (
    <Button
      mode="elevated"
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: colors.primary,
          opacity: disabled || loading ? 0.6 : 1,
        }, // Reduce opacity if disabled or loading
        style,
      ]}
      contentStyle={styles.content} // Ensures the full button area is clickable
      labelStyle={styles.label}
      disabled={loading || disabled}
      // Disables pointer events to show "disabled" pointer
      pointerEvents={disabled || loading ? "none" : "auto"}
    >
      <View style={styles.contentWrapper}>
        {loading ? (
          <>
            <ActivityIndicator size="small" color="#fff" />
          </>
        ) : (
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        )}
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    minWidth: 150, // Ensures button is always visible
    paddingVertical: 5,
  },
  content: {
    height: 40, // Prevents layout shift
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomButton;
