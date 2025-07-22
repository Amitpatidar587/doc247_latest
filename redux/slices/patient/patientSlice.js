import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app_common/auth/api";

// 🔹 Fetch Single Patient Details
export const fetchPatientDetails = createAsyncThunk(
  "patient/fetchPatientDetails",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/patients/${id}/`);
      return response.data?.patient;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch patient details"
      );
    }
  }
);
// 🔹 Fetch Single Patient Details
export const UpdatePatientDetails = createAsyncThunk(
  "patient/UpdatePatientDetails",
  async ({ id, patientData }, { rejectWithValue }) => {
    // console.log("patientData", patientData);
    try {
      const response = await api.put(`/user/patients/${id}/`, patientData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch patient details"
      );
    }
  }
);

export const fetchMedicalRecordsById = createAsyncThunk(
  "patient/fetchMedicalRecords",
  async ({ payload }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/additional/`, {
        params: { ...payload },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch patient details"
      );
    }
  }
);

// 🏛️ Patient Slice
const patientSlice = createSlice({
  name: "patient",
  initialState: {
    patient: null,
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    resetPatient: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload;
        state.error = null;
      })
      .addCase(fetchPatientDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(UpdatePatientDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdatePatientDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.success;
        state.message = action.payload?.message;
        state.error = null;
      })
      .addCase(UpdatePatientDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMedicalRecordsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalRecordsById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.medicalRecords = action.payload.data;
        state.error = null;
      })
      .addCase(fetchMedicalRecordsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPatient } = patientSlice.actions;
export default patientSlice.reducer;
