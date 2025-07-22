import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
import { TextInput, Surface } from "react-native-paper";
import axios from "axios";
import { useSelector } from "react-redux";
import { countries } from "../../countrycode.json"; // Make sure this has `name`, `alpha2`

const PostalCodeLookup = ({ label, onChange, onResult, defaultValue }) => {
  const { theme } = useSelector((state) => state.theme);
  const colors = theme.colors;

  const initialCountry =
    countries.find((c) => c.name === defaultValue?.country)?.alpha2 ||
    countries[0].alpha2;
  const initialPostal = defaultValue?.postalCode || "";

  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [postalCode, setPostalCode] = useState(initialPostal);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (postalCode.length >= 3) {
      handleLookup(postalCode.trim(), selectedCountry);
    }
  }, [postalCode]);

  const handleCountryChange = (code) => {
    setSelectedCountry(code);
    setMenuVisible(false);
    onChange({ country: code, postalCode });
  };

  const handlePostalChange = (text) => {
    setPostalCode(text);
    onChange({ country: selectedCountry, postalCode: text });
  };

  const getCountryNameFromCode = (code) => {
    const match = countries.find((c) => c.alpha2 === code);
    return match ? match.name : code;
  };

  const handleLookup = async (postal, countryCode) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.zippopotam.us/${countryCode}/${postal}`
      );
      const place = response?.data?.places?.[0];
      const result = response.data;
      if (place) {
        const placeName = place["place name"];
        const trimmed = placeName.substring(0, 50);
        const fullWord = trimmed.replace(/\s+\S*$/, ""); // avoid cutting mid-word
        const city = fullWord;

        const state = place["state"];
        const postal_code = result["post code"];
        const country = result["country"];
        const address = `${place["place name"]}, ${state}`;

        // console.log({ city, state, postal_code, country, address });

        onResult({ city, state, postal_code, country, address });
      } else {
        onResult({
          postal_code: postal,
          country: getCountryNameFromCode(countryCode),
        });
      }
    } catch (error) {
      // fallback on error
           onResult({
          postal_code: postal,
          country: getCountryNameFromCode(countryCode),
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Floating label via dummy TextInput */}
      {/* <TextInput
        label={label}
        value={postalCode}
        editable={false}
        pointerEvents="none"
        style={{ height: 0, marginBottom: -20 }}
        mode="outlined"
        theme={{
          colors: {
            primary: colors.primary,
            text: "transparent",
          },
        }}
      /> */}

      <Text style={styles.label}> {label}</Text>

      <View style={[styles.inputGroup, { borderColor: colors.outline }]}>
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={styles.codeSelector}
        >
          <Text style={[styles.codeText, { color: colors.primary }]}>
            {selectedCountry}
          </Text>
        </TouchableOpacity>

        <TextInput
          mode="flat"
          value={postalCode}
          onChangeText={handlePostalChange}
          placeholder="Postal Code"
          keyboardType="default"
          underlineColor="transparent"
          style={[styles.postalInput, { backgroundColor: "transparent" }]}
          theme={{
            colors: {
              text: colors.onSurface,
              placeholder: colors.outline,
              primary: "transparent", // Removes active underline color
              underlineColor: "transparent", // Extra safety
            },
          }}
        />
      </View>

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
              Select Country
            </Text>
            <ScrollView style={styles.scrollView}>
              {countries.map((c, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleCountryChange(c.alpha2)}
                  style={[
                    styles.optionContainer,
                    selectedCountry === c.alpha2 && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedCountry === c.alpha2 && {
                        color: colors.onPrimary,
                      },
                    ]}
                  >
                    {`${c.name} (${c.alpha2})`}
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
  container: {
    marginVertical: 16,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    height: 50,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  codeSelector: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    marginRight: 8,
  },
  codeText: {
    fontSize: 16,
  },
  postalInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "transparent",
    height: 50,
    paddingVertical: 0,
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
  label: {
    position: "absolute",
    top: -10,
    left: 8,
    fontSize: 12,
    marginBottom: 4,
    paddingRight: 8,
    zIndex: 1,
    backgroundColor: "#fff",
  },
});

export default PostalCodeLookup;
