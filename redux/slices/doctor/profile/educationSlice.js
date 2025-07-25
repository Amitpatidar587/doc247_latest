// redux/Slices/educationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app_common/auth/api";

// Async thunk to fetch all education records with optional search parameters
export const fetchEducation = createAsyncThunk(
  "education/fetchEducation",
  async ({ doctorId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/education/`, {
        params: {
          doctor_id: doctorId,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching education:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch education data"
      ); // Return error details
    }
  }
);

// Async thunk to add a new education record
export const addEducation = createAsyncThunk(
  "education/addEducation",
  async ({ doctorId, educationData }, { rejectWithValue }) => {
    try {
      const response = await api.post("/education/", {
        ...educationData,
        doctor_id: doctorId,
      });
      return response.data;
    } catch (error) {
      console.log("Error adding education:", error);
      return rejectWithValue(error.response?.data || "Failed to add education"); // Return error details
    }
  }
);

// Async thunk to update an existing education record
export const updateEducation = createAsyncThunk(
  "education/updateEducation",
  async ({ educationData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/education/${educationData.id}/`, {
        ...educationData,
      });

      return response.data;
    } catch (error) {
      console.log("Error updating education:", error);
      return rejectWithValue(
        error.response?.data || "Failed to update education"
      ); // Return error details
    }
  }
);

// Async thunk to delete an education record
export const deleteEducation = createAsyncThunk(
  "education/deleteEducation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/education/${id}/`);
      return response.data;
    } catch (error) {
      console.log("Error deleting education:", error);
      return rejectWithValue(
        error.response?.data || "Failed to delete education"
      ); // Return error details
    }
  }
);

// Create the education slice
const educationSlice = createSlice({
  name: "education",

  initialState: {
    educations: [], // Array to store education records
    loading: false, // Flag to indicate loading state
    success: false, // Flag to indicate success state
    error: null, // Store error details
    message: null,
    fetchloading: false, // Store success message
  },
  reducers: {
    resetEducationState: (state) => {
      state.success = false;
      state.message = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducation.pending, (state) => {
        state.fetchloading = true; // Set loading state
      })
      .addCase(fetchEducation.fulfilled, (state, action) => {
        state.educations = action.payload.data;
        state.fetchloading = false;
      })
      .addCase(fetchEducation.rejected, (state, action) => {
        state.fetchloading = false; // Set failure state
        state.error = action.payload; // Store error details
      })

      .addCase(addEducation.pending, (state) => {
        state.loading = true; // Set loading state
      })

      .addCase(addEducation.fulfilled, (state, action) => {
        state.loading = false; // Set success state
        state.success = action.payload.success;
        state.message = action.payload.message;
      })

      .addCase(addEducation.rejected, (state, action) => {
        state.loading = false; // Set failure state
        state.error = action.payload; // Store error details
      })

      .addCase(updateEducation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        // Update the education record in the state
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.loading = false;
      })

      .addCase(updateEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteEducation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetEducationState } = educationSlice.actions;
export default educationSlice.reducer;
