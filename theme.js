import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

// Define Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#0474ed",
    secondary: "#333",
    primarybgtext: "#ffffff",
    background: "#ffffff",
    surface: "#ffffff",
    text: "#333333",
  },
};

// Define Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#bb86fc",
    secondary: "#03dac6",
    primarybgtext: "#333",
    background: "#121212",
    surface: "#1e1e1e",
    text: "#cccccc",
  },
};
// export const darkTheme = {
//  ...MD3LightTheme,
//   colors: {
//     ...MD3LightTheme.colors,
//     primary: "#0474ed",
//     secondary: "#333",
//     primarybgtext: "#ffffff",
//     background: "#ffffff",
//     surface: "#ffffff",
//     text: "#333333",
//   },
// };
