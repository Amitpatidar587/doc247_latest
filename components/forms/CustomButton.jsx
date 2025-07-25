import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

const CustomButton = ({
  title,
  onPress,
  textColor = "#fff",
  style,
  loading = false,
  disabled = false,
  size = "lg", // sm, md, lg
}) => {
  const { colors } = useTheme();

  // Size configurations
  const sizeStyles = {
    sm: {
      paddingVertical: 6,
      paddingHorizontal: 16,
      fontSize: 14,
      borderRadius: 50,
      minHeight: 36,
    },
    md: {
      paddingVertical: 9,
      paddingHorizontal: 20,
      fontSize: 16,
      borderRadius: 50,
      minHeight: 36,
    },
    lg: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      fontSize: 18,
      borderRadius: 50,
      minHeight: 30,
    },
  };

  const currentSizeStyle = sizeStyles[size] || sizeStyles.md;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          opacity: disabled || loading ? 0.6 : 1,
          backgroundColor: colors.background,
          borderColor: colors.primary,
          borderWidth: 1,
          paddingVertical: currentSizeStyle.paddingVertical,
          paddingHorizontal: currentSizeStyle.paddingHorizontal,
          borderRadius: currentSizeStyle.borderRadius,
          minHeight: currentSizeStyle.minHeight,
        },
        style,
      ]}
      disabled={disabled || loading}
    >
      <View
        style={[
          styles.contentWrapper,
          {
            minHeight:
              currentSizeStyle.minHeight - currentSizeStyle.paddingVertical * 2,
          },
        ]}
      >
        {loading ? (
          <>
            <ActivityIndicator size={"small"} color={colors.primary} />
          </>
        ) : (
          <Text
            style={[
              styles.text,
              {
                color: colors.primary,
                fontSize: currentSizeStyle.fontSize,
              },
            ]}
          >
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomButton;
