import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app_common/auth/api";

// Fetch availability
export const fetchAvailability = createAsyncThunk(
  "availability/fetchAvailability",
  async ({ doctorId, slot_day }, { rejectWithValue }) => {
    try {
      const response = await api.get("/availability/", {
        params: { slot_doctor_id: doctorId, slot_day: slot_day },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch availability"
      );
    }
  }
);

// Add new availability
export const addAvailability = createAsyncThunk(
  "availability/addAvailability",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/availability/", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add availability"
      );
    }
  }
);

// Update availability
export const updateAvailability = createAsyncThunk(
  "availability/updateAvailability",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.put(`/availability/${payload.id}/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update availability"
      );
    }
  }
);

// Delete a single availability by ID
export const deleteAvailabilityById = createAsyncThunk(
  "availability/deleteAvailabilityById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/availability/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete availability"
      );
    }
  }
);

export const getDayOff = createAsyncThunk(
  "availability/getDayOff",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.get(`/booking/off/${payload}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get day off availability"
      );
    }
  }
);

// day off availability
export const dayOffAvailability = createAsyncThunk(
  "availability/dayOffAvailability",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(`/booking/off/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update availability"
      );
    }
  }
);

export const deleteDayOff = createAsyncThunk(
  "availability/deleteDayOff",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/booking/off/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete day off availability"
      );
    }
  }
);

const availabilitySlice = createSlice({
  name: "availability",
  initialState: {
    loading: false, // true | false
    message: null,
    success: false,
    error: null,
    Slots: [],
  },
  reducers: {
    resetAvailability: (state) => {
      state.loading = false;
      state.message = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch availability
      .addCase(fetchAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.Slots = action.payload.data;
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to fetch availability";
        state.success = false;
      })

      // Add availability
      .addCase(addAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Availability added successfully!";
        state.success = action.payload.success || true;
      })
      .addCase(addAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to add availability";
        state.success = false;
      })

      // Update availability
      .addCase(updateAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Availability updated successfully!";
        state.success = action.payload.success || true;
      })
      .addCase(updateAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to update availability";
        state.success = false;
      })

      // Delete a single availability by ID
      .addCase(deleteAvailabilityById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAvailabilityById.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Availability deleted successfully!";
        state.success = action.payload.success || true;
      })
      .addCase(deleteAvailabilityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to delete availability";
        state.success = false;
      })

      // Day off availability

      .addCase(getDayOff.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDayOff.fulfilled, (state, action) => {
        state.loading = false;
        state.dayOff = action.payload.data;
      })
      .addCase(getDayOff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(dayOffAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(dayOffAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Availability updated successfully!";
        state.success = action.payload?.success;
      })
      .addCase(dayOffAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to update availability";
        state.success = false;
      })

      // Delete day off availability by ID
      .addCase(deleteDayOff.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDayOff.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(deleteDayOff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to delete availability";
        state.success = false;
      });
  },
});

export const { resetAvailability } = availabilitySlice.actions;

export default availabilitySlice.reducer;
