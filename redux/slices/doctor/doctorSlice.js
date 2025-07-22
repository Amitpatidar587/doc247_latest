import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app_common/auth/api";

// 🔹 Fetch Single Doctor Details (Existing)
export const fetchDoctorDetails = createAsyncThunk(
  "doctor/fetchDoctorDetails",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/doctor_profile/", {
        doctor_id: doctorId,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch doctor details"
      );
    }
  }
);

// 🔹 Update Doctor Details using PUT
export const updateDoctor = createAsyncThunk(
  "doctor/updateDoctor",
  async ({ id, doctorData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/user/doctors/${id}/`, doctorData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update doctor details"
      );
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  "doctor/fetchDoctorById",
  async (doctorId, { rejectWithValue }) => {
    console.log(doctorId);
    try {
      const response = await api.get(`/user/doctors/${doctorId}/`, {});

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch doctor details"
      );
    }
  }
);

// 🔹 Fetch List of Doctors with Query Parameters
export const fetchDoctors = createAsyncThunk(
  "doctor/fetchDoctors",
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/doctors/", {
        params: { ...queryParams },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch doctors"
      );
    }
  }
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    doctorData: null, // For single doctor details
    doctorsList: [], // For list of doctors fetched via fetchDoctors
    loading: false,
    error: null,
    success: false,
    message: null,
    hasfetched: false,
    search: "",
    selectedDoctor: null,
  },
  reducers: {
    searchQuery: (state, action) => {
      state.search = action.payload;
    },
    resetsearchQuery: (state) => {
      state.search = "";
    },

    selectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    resetSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDoctorDetails cases
      .addCase(fetchDoctorDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorData = action.payload?.data;
      })
      .addCase(fetchDoctorDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateDoctor cases
      .addCase(updateDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchDoctorById cases
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.doctor = action.payload.doctor;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchDoctors (list) cases
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorsList = action.payload.data;
        state.pagination = action.payload.pagination;
        state.success = action.payload.success;
        state.hasfetched = true;
        // Adjust this if your API returns a different field name
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  searchQuery,
  selectedDoctor,
  reset,
  resetSelectedDoctor,
  resetsearchQuery,
} = doctorSlice.actions;
export default doctorSlice.reducer;
