import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app_common/auth/api";



// 🔹 Fetch Experiences (Includes Token in Header)
export const fetchExperiences = createAsyncThunk(
  "experiences/fetchExperiences",
  async ({ doctorId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/experience/`, {
        params: { doctor_id: doctorId },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch experiences"
      );
    }
  }
);

// 🔹 Add Experience
export const addExperience = createAsyncThunk(
  "experiences/addExperience",
  async ({ doctorId, experienceData }, { rejectWithValue }) => {
    try {
      const response = await api.post("/experience/", {
        doctor_id: doctorId,
        ...experienceData,
      });
      return response.data; // Extract only "experience" object
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to add experience"
      );
    }
  }
);

// 🔹 Update Experience
export const updateExperience = createAsyncThunk(
  "experiences/updateExperience",
  async ({ experienceData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/experience/${experienceData.id}/`, {
        ...experienceData,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update experience"
      );
    }
  }
);

// 🔹 Delete Experience
export const deleteExperience = createAsyncThunk(
  "experiences/deleteExperience",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/experience/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete experience"
      );
    }
  }
);

// 🏆 **Experience Slice**
const experienceSlice = createSlice({
  name: "experiences",
  initialState: {
    experiences: [],
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    resetExperienceState: (state) => {
      state.success = false;
      state.message = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Experiences
      .addCase(fetchExperiences.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = action.payload;
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Experience
      .addCase(addExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(addExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Experience
      .addCase(updateExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Experience
      .addCase(deleteExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetExperienceState } = experienceSlice.actions;

export default experienceSlice.reducer;
