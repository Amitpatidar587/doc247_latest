import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

const CustomButton = ({
  title,
  onPress,
  textColor,
  style,
  loading = false,
  disabled = false,
  size = "lg", // sm, md, lg
  variant = "primary", // primary, danger
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
      paddingVertical: 8,
      paddingHorizontal: 20,
      fontSize: 16,
      borderRadius: 50,
      minHeight: 36,
    },
    lg: {
      paddingVertical: 10,
      paddingHorizontal: 24,
      fontSize: 18,
      borderRadius: 50,
      minHeight: 30,
    },
  };

  // Variant configurations
  const variantStyles = {
    primary: {
      backgroundColor: colors.background,
      borderColor: colors.primary,
      textColor: colors.primary,
      activityIndicatorColor: colors.primary,
    },
    danger: {
      backgroundColor: colors.background,
      borderColor: colors.error || "#e74c3c",
      textColor: colors.error || "#e74c3c",
      activityIndicatorColor: colors.error || "#e74c3c",
    },
  };

  const currentSizeStyle = sizeStyles[size] || sizeStyles.md;
  const currentVariantStyle = variantStyles[variant] || variantStyles.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          opacity: disabled || loading ? 0.6 : 1,
          backgroundColor: currentVariantStyle.backgroundColor,
          borderColor: currentVariantStyle.borderColor,
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
            <ActivityIndicator 
              size={"small"} 
              color={currentVariantStyle.activityIndicatorColor} 
            />
          </>
        ) : (
          <Text
            style={[
              styles.text,
              {
                color: textColor || currentVariantStyle.textColor,
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