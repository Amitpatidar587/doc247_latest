import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useSelector } from "react-redux";

const CustomTextInput = ({
  label,
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  editable = true,
  error,
}) => {
  const { theme } = useSelector((state) => state.theme);
  const colors = theme.colors;

  const [inputHeight, setInputHeight] = useState(0);

  const handleContentSizeChange = (e) => {
    const height = e.nativeEvent.contentSize.height;
    setInputHeight(height);
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        label={label}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        secureTextEntry={secureTextEntry}
        onContentSizeChange={multiline ? handleContentSizeChange : undefined}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            opacity: editable ? 1 : 0.5,
            minHeight: multiline ? 0 : undefined,
            height: multiline ? Math.max(1, inputHeight) : undefined,
          },
        ]}
        contentStyle={
          multiline ? { paddingVertical: 4, paddingHorizontal: 8 } : undefined
        }
        mode="outlined"
        theme={{
          colors: {
            primary: colors.primary,
            underlineColor: "transparent",
            text: colors.text,
          },
          borderRadius: 10,
        }}
        selectionColor={colors.primary}
        activeOutlineColor={colors.primary}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor={colors.text}
        error={!!error}
      />

      {error ? (
        <Text style={[styles.errorText, { color: colors.error || "#dc3545" }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  input: {},
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomTextInput;
