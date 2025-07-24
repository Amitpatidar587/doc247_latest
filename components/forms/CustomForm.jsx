import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import {  Text, Switch } from "react-native-paper";
import { useSelector } from "react-redux";

import CustomTextInput from "./CustomTextInput";
import CustomDatePicker from "../modals/CustomDatePicker";
import CustomSelect from "./CustomSelect";
import TimePickerModal from "../modals/TimePickerModal";
import CustomButton from "./CustomButton";
import PhoneInput from "./PhoneInput";
import TagInput from "./TagInput";
import PostalCodeLookup from "./PostalLookup.jsx";
import { useState } from "react";

const CustomForm = ({
  fields,
  setFieldValue,
  isEditing,
  handleSave,
  handleCancel,
  loading,
  style,
  scrollStyle,
  buttonStyles = {},
  formColors = {},
  generalError = "",
}) => {
  const { theme } = useSelector((state) => state.theme);
  const [errors, setErrors] = useState({});

  const colors = theme.colors;
  const mergedColors = {
    primary: formColors.primary || colors.primary,
    border: formColors.border || "#ddd",
  };

  const validateFields = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (
        field.required &&
        (!field.value || field.value.toString().trim() === "")
      ) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const onSave = () => {
    if (validateFields()) {
      handleSave();
    }
  };

  const renderField = (field, index) => {
    switch (field.type) {
      case "date":
        return (
          <React.Fragment key={field.name}>
            <CustomDatePicker
              key={index}
              label={field.label}
              value={field.value}
              onDateChange={(date) => setFieldValue(field.name, date)}
              icon={field.icon || "calendar-outline"}
              disableFutureDates={field.disableFutureDates}
              disablePastDates={field.disablePastDates}
              disabled={field.disabled || false}
              minDate={field.minDate || null} // 👈 Add this line
            />
            {errors[field.name] && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 1 }}>
                {errors[field.name]}
              </Text>
            )}
          </React.Fragment>
        );
      case "tag":
        return (
          <React.Fragment key={field.name}>
            <TagInput
              key={index}
              label={field.label}
              initialTags={field.value}
              onChange={(value) => setFieldValue(field.name, value)}
            />
            {errors[field.name] && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 1 }}>
                {errors[field.name]}
              </Text>
            )}
          </React.Fragment>
        );

      case "select":
        return (
          <React.Fragment key={field.name}>
            <CustomSelect
              key={index}
              label={field?.label}
              value={field?.value}
              options={field?.options}
              onSelect={(value) => setFieldValue(field.name, value)}
              icon={field.icon || "menu-down"} // Icon for the dropdown arrow (optional)
              disabled={field?.disabled || false}
            />
            {errors[field.name] && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 1 }}>
                {errors[field.name]}
              </Text>
            )}
          </React.Fragment>
        );
      case "checkbox":
        return (
          <View key={index} style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>{field.label}</Text>
            <Switch
              value={field.value}
              onValueChange={(value) => setFieldValue(field.name, value)}
              color={mergedColors.primary}
            />
          </View>
        );
      case "time":
        return (
          <React.Fragment key={field.name}>
            <TimePickerModal
              key={index}
              label={field.label}
              value={field.value}
              onTimeChange={(time) => setFieldValue(field.name, time)}
              icon="clock-outline"
              disabled={field.disabled || false}
              minTime={field.minTime}
            />
            {errors[field.name] && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 1 }}>
                {errors[field.name]}
              </Text>
            )}
          </React.Fragment>
        );
      case "number":
        return (
          <React.Fragment key={field.name}>
            <CustomTextInput
              key={index}
              label={field?.label}
              value={field?.value && field?.value.toString()}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, "");
                setFieldValue(field.name, numericValue);
              }}
              editable={field?.editable !== false}
              keyboardType="numeric"
              icon={field?.icon}
              disabled={field?.disabled || false}
            />
            {errors[field.name] && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 1 }}>
                {errors[field.name]}
              </Text>
            )}
          </React.Fragment>
        );

      case "phone":
        return (
          <React.Fragment key={field.name}>
            <PhoneInput
              key={index}
              label={field.label}
              defaultValue={field.value}
              onChange={(value) => setFieldValue(field.name, value)}
            />
            {errors[field.name] && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 1 }}>
                {errors[field.name]}
              </Text>
            )}
          </React.Fragment>
        );

      case "postal_lookup":
        return (
          <React.Fragment key={field.name}>
            <PostalCodeLookup
              label={field?.label}
              key={index}
              defaultValue={field?.value}
              onChange={(value) => {
                setFieldValue(field.name, value);
              }}
              onResult={(address) => {
                setFieldValue("address", address?.address);
                setFieldValue("city", address?.city);
                setFieldValue("state", address?.state);
                setFieldValue("country", address?.country);
                setFieldValue("postal_code", address?.postal_code);
              }}
            />
            {errors[field.name] && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 1 }}>
                {errors[field.name]}
              </Text>
            )}
          </React.Fragment>
        );

      default:
        return (
          <React.Fragment key={field.name}>
            <CustomTextInput
              key={index}
              label={field.label}
              value={field.value}
              onChangeText={(text) => setFieldValue(field.name, text)}
              editable={field.editable !== false}
              keyboardType={field.keyboardType || "default"}
              icon={field.icon}
              disabled={field.disabled || false}
            />
            {errors[field.name] && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 1 }}>
                {errors[field.name]}
              </Text>
            )}
          </React.Fragment>
        );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.keyboardAvoidingContainer,
        style,
        { backgroundColor: mergedColors.background },
      ]}
    >
      {/* <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Edit Personal Information
      </Text> */}
      <View style={styles.container}>
        <View style={[styles.formContainer, scrollStyle]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {fields.map((field, index) => renderField(field, index))}
            {generalError && (
              <Text style={{ color: "red", fontSize: 14, marginTop: 1 }}>
                {generalError}
              </Text>
            )}
          </ScrollView>
        </View>

        {isEditing && (
          <View
            style={[
              styles.buttonContainer,
              {
                borderColor: mergedColors.border,
                backgroundColor: mergedColors.background,
              },
            ]}
          >
            <CustomButton
              title="Save Changes"
              onPress={onSave}
              style={[
                styles.saveButton,
                { backgroundColor: mergedColors.primary },
                buttonStyles.saveButton,
              ]}
              loading={loading}
            />

            {handleCancel && (
              <TouchableOpacity
                onPress={handleCancel}
                style={[
                  styles.cancelButton,
                  buttonStyles.cancelButton,
                  { borderColor: mergedColors.primary },
                ]}
              >
                <Text> Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  formContainer: {
    flex: 1,
    height: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 10,
    // maxHeight: 100,
    // borderTopWidth: 1,
  },
  // saveButton: {
  //   marginRight: 10,
  // },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    // maxWidth: 150,
    // paddingVertical: 5,
  },
});

export default CustomForm;
