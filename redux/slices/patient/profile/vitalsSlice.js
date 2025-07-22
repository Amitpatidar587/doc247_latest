import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app_common/auth/api";
// 🔹 Fetch All Vitals
export const fetchVitals = createAsyncThunk(
  "vitals/fetchVitals",
  async ({ patient_id, doctor_id, appointment_id }, { rejectWithValue }) => {
    try {
      const response = await api.get("/vitals/", {
        params: { patient_id, doctor_id, appointment_id },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(console.log(error), "Failed to fetch vitals");
    }
  }
);

// 🔹 Create New Vital
export const createVital = createAsyncThunk(
  "vitals/createVital",
  async ({ vitalData, patient_id }, { rejectWithValue }) => {
    try {
      const response = await api.post("/vitals/", { ...vitalData, patient_id });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        // console.log(error),
        "Failed to create vital record"
      );
    }
  }
);

// 🔹 Update Vital
export const updateVital = createAsyncThunk(
  "vitals/updateVital",
  async ({ id, vitalData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/vitals/${id}/`, { ...vitalData });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        console.log(error),
        "Failed to update vital record"
      );
    }
  }
);

// 🔹 Delete Vital
export const deleteVital = createAsyncThunk(
  "vitals/deleteVital",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/vitals/${id}/`);
      return { id, message: "Vital deleted successfully" };
    } catch (error) {
      return rejectWithValue(
        console.log(error),
        "Failed to delete vital record"
      );
    }
  }
);

const vitalsSlice = createSlice({
  name: "vitals",
  initialState: {
    vitals: [],
    selectedVital: null,
    loading: false,
    message: null,
    success: null,
    error: null,
  },
  reducers: {
    // Allows resetting the state messages if needed
    resetVitalsState: (state) => {
      state.message = null;
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Vitals
      .addCase(fetchVitals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVitals.fulfilled, (state, action) => {
        state.loading = false;
        state.vitals = action.payload?.data;
      })
      .addCase(fetchVitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to fetch vitals";
        state.success = false;
      })

      // Create Vital
      .addCase(createVital.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVital.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Vital created successfully";
        state.success =
          action.payload.success !== undefined ? action.payload.success : true;
      })
      .addCase(createVital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to create vital record";
        state.success = false;
      })

      // Update Vital
      .addCase(updateVital.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVital.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Vital updated successfully";
        state.success =
          action.payload.success !== undefined ? action.payload.success : true;
      })
      .addCase(updateVital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to update vital record";
        state.success = false;
      })

      // Delete Vital
      .addCase(deleteVital.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteVital.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Vital deleted successfully";
        state.success = true;
      })
      .addCase(deleteVital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to delete vital record";
        state.success = false;
      });
  },
});

export const { resetVitalsState } = vitalsSlice.actions;
export default vitalsSlice.reducer;
