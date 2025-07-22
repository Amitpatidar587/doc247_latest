import { createSlice } from "@reduxjs/toolkit";
import { lightTheme, darkTheme } from "../../../../theme"; // Import your themes

const initialState = {
  isDarkMode: false, // Default to light mode
  theme: lightTheme, // Set initial theme
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      state.theme = state.isDarkMode ? darkTheme : lightTheme;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
