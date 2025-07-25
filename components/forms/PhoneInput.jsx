import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import { TextInput, Surface, Text, useTheme } from "react-native-paper";
import { countries } from "../../countrycode.json";

const PhoneInput = ({ label, onChange, defaultValue, error }) => {
  const {colors} = useTheme();

  const initialCode = defaultValue?.country_code || countries[0].callingCode;
  const initialContact = defaultValue?.contact || "";

  const [selectedCode, setSelectedCode] = useState(initialCode);
  const [phoneNumber, setPhoneNumber] = useState(initialContact);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setSelectedCode(defaultValue.country_code || countries[0].callingCode);
      setPhoneNumber(defaultValue.contact || "");
    }
  }, [defaultValue]);

  const handleCodeChange = (code) => {
    setSelectedCode(code);
    setMenuVisible(false);
    onChange({ country_code: code, contact: phoneNumber });
  };

  const handlePhoneChange = (text) => {
    setPhoneNumber(text);
    onChange({ country_code: selectedCode, contact: text });
  };

  return (
    <View style={styles.wrapper} >
      <TextInput
        mode="outlined"
        label={label}
        value={phoneNumber}
        onChangeText={handlePhoneChange}
        keyboardType="phone-pad"
        left={
          <TextInput.Icon
            style={styles.codeContainer}
            icon={() => (
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Text style={[styles.codeText, { color: colors.primary }]}>
                  {selectedCode}
                </Text>
              </TouchableOpacity>
            )}
          />
        }
        placeholder="Phone number"
        theme={{
          colors: {
            primary: colors.primary,
            text: colors.text,
            placeholder: colors.outline,
            error: colors.error,
            background: colors.surface,
          },
          roundness: 4,
        }}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
          },
        ]}
        error={!!error}
        placeholderTextColor={colors.outline}
      />

      {error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : null}

      {/* Country Code Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <Surface
            style={[styles.surface, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              Select Country Code
            </Text>
            <ScrollView style={styles.scrollView}>
              {countries.map((c, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleCodeChange(c.callingCode)}
                  style={[
                    styles.optionContainer,
                    selectedCode === c.callingCode && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedCode === c.callingCode && {
                        color: colors.onPrimary,
                      },
                    ]}
                  >
                    {`${c.alpha2} (${c.callingCode})`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Surface>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    backgroundColor: "transparent",
  },
  codeContainer: {
    minWidth: 60,
    // justifyContent: "flex-start",
    alignItems: "stretch",
    // paddingHorizontal: 8,
  },

  codeText: {
    fontSize: 16,
    // paddingHorizontal: 4,
    // flexShrink: 1,
    // textAlign: "center",
    fontWeight: "bold",
    borderRightWidth: 1,
    borderRightColor: "black",
  },

  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  surface: {
    padding: 16,
    borderRadius: 4,
    width: 300,
    maxHeight: 500,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  scrollView: {
    maxHeight: 500,
    width: "100%",
  },
  optionContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionText: {
    fontSize: 16,
  },
});

export default PhoneInput;
