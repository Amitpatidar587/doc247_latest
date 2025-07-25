import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app_common/auth/api.js";

// Fetch All Medical Records
export const fetchMedicalRecords = createAsyncThunk(
  "medicalRecords/fetchMedicalRecords",
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/additional/?patient_id=${patient_id}`);
      return response.data?.data;
    } catch (error) {
      console.log(error, "error");
      return rejectWithValue(error.response?.data || "Server Error");
    }
  }
);

// Fetch Single Medical Record by ID
export const fetchMedicalRecord = createAsyncThunk(
  "medicalRecords/fetchMedicalRecord",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/additional/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Server Error");
    }
  }
);

// Add New Medical Record
export const addMedicalRecord = createAsyncThunk(
  "medicalRecords/addMedicalRecord",
  async (recordData, { rejectWithValue }) => {
    try {
      const response = await api.post("/additional/", recordData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Server Error");
    }
  }
);

// Update Existing Medical Record
export const updateMedicalRecord = createAsyncThunk(
  "medicalRecords/updateMedicalRecord",
  async ({ id, record }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/additional/${id}/`, record);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Server Error");
    }
  }
);

// Delete Medical Record
export const deleteMedicalRecord = createAsyncThunk(
  "medicalRecords/deleteMedicalRecord",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/additional/${id}/`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Server Error");
    }
  }
);

export const fetchPrescriptions = createAsyncThunk(
  "appointment/fetchPrescriptions",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(`/additional/session/`, {
        ...payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get prescriptions"
      );
    }
  }
);

const medicalRecordSlice = createSlice({
  name: "medicalRecords",
  initialState: {
    records: [],
    record: null,
    loading: false,
    message: null,
    success: null,
    error: null,
  },
  reducers: {
    resetMedicalState: (state) => {
      state.message = null;
      state.success = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalRecords.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedicalRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchMedicalRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMedicalRecord.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchMedicalRecord.fulfilled, (state, action) => {
        state.record = action.payload;
      })
      .addCase(fetchMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPrescriptions.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload?.data;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMedicalRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMedicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })

      .addCase(addMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteMedicalRecord.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteMedicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.success;
        state.message = action.payload?.message;
      })

      .addCase(deleteMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMedicalState } = medicalRecordSlice.actions;

export default medicalRecordSlice.reducer;
