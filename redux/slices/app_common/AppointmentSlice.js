import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./auth/api";

export const fetchAppointments = createAsyncThunk(
  "appointment/fetchAppointments",
  async ({ doctor_id, patient_id, status, search }, { rejectWithValue }) => {
    try {
      const params = {
        doctor_id,
        patient_id,
        status,
        ...(search?.search && { search: search.search }),
        ...(search?.appointment_date && {
          appointment_date: search.appointment_date,
        }),
        ...(search?.visitType && { visit_type: search.visitType }),
        ...(search?.appointmentType && {
          appointment_type: search.appointmentType,
        }),
        ...(search?.page && { page: search.page }),
        ...(search?.page_size && { page_size: search.page_size }),
      };
      // console.log("params", params);
      const response = await api.get("/appointment/", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get appointments"
      );
    }
  }
);

// 🔹 Create Appointment
export const createAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async (appointmentData, { rejectWithValue }) => {
    // console.log("appointmentData", appointmentData);
    try {
      const response = await api.post("/appointment/", appointmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create appointment"
      );
    }
  }
);

// 🔹 Update Appointment
export const updateAppointment = createAsyncThunk(
  "appointment/updateAppointment",
  async ({ appointmentId, status }, { rejectWithValue }) => {
    // console.log("status", appointmentId);
    try {
      const response = await api.put(`/appointment/${appointmentId}/`, {
        status,
      });
      return response.data;
    } catch (error) {
      // console.log("Error updating appointment:", error.response?.data || error);
      return rejectWithValue(
        error.response?.data || "Failed to update appointment"
      );
    }
  }
);

// 🔹 Delete Appointment
export const deleteAppointment = createAsyncThunk(
  "appointment/deleteAppointment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/appointment/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete appointment"
      );
    }
  }
);

// 🔹 Get Available Slots
export const getAvailableSlots = createAsyncThunk(
  "appointment/getAvailableSlots",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/availability/slots/", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch available slots"
      );
    }
  }
);

// 🔹 Create Booked Slot
export const createBookedSlot = createAsyncThunk(
  "appointment/createBookedSlot",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post("/booking/", bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booked slot"
      );
    }
  }
);

export const fetchAllPharmacies = createAsyncThunk(
  "pharmacy/fetchAllPharmacies",
  async ({ payload }, { rejectWithValue }) => {
    try {
      // console.log("payload", payload);
      const params = {
        ordering: payload?.ordering || "",
        ...payload,
      };
      const response = await api.get("/pharmacy/", {
        params,
        noAuth: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch pharmacies"
      );
    }
  }
);

export const createPrescription = createAsyncThunk(
  "appointment/createPrescription",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/additional/session/create/", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create medical record"
      );
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointment",

  initialState: {
    appointments: [],
    createAppointmentData: null,
    availableSlots: [],
    pharmacies: [],
    fetchAppointmentsLoading: false,
    updateAppointmentLoading: false,
    deleteAppointmentLoading: false,
    getAvailableSlotsLoading: false,
    message: null,
    success: false,
    error: null,
    selectedAppointment: null,
  },

  reducers: {
    resetAppointmentState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
    selectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    resetSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    },
    resetAppointmentsList: (state) => {
      state.appointments = [];
      state.pagination = {};
    },
    resetCreateAppointment: (state) => {
      state.createAppointmentData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.pagination = action.payload.pagination;
        const append = action.meta.arg?.append;
        if (append) {
          state.appointments = [...state.appointments, ...action.payload.data];
        } else {
          state.appointments = action.payload.data;
        }
      })

      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to get appointments";
        state.success = false;
      })

      // Create Appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.createAppointmentData = action.payload?.appointment;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        loading = false;
        state.error = action.payload;
        state.message = "Failed to create appointment";
        state.success = false;
      })

      // Update Appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.message =
          action.payload.message || "Appointment updated successfully!";
        state.success = action.payload.success || true;
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to update appointment";
        state.success = false;
      })

      // Create Booked Slot
      .addCase(createBookedSlot.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBookedSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Booked slot created successfully!";
        state.success = true;
      })
      .addCase(createBookedSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to create booked slot";
        state.success = false;
      })

      // Delete Appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(
          (app) => app.id !== action.payload.id
        );
        state.message =
          action.payload.message || "Appointment deleted successfully!";
        state.success = action.payload.success || true;
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Failed to delete appointment";
        state.success = false;
      })

      // Get Available Slots
      .addCase(getAvailableSlots.pending, (state) => {
        state.getAvailableSlotsLoading = true;
      })
      .addCase(getAvailableSlots.fulfilled, (state, action) => {
        state.getAvailableSlotsLoading = false;
        state.availableSlots = action.payload?.data?.data;
      })
      .addCase(getAvailableSlots.rejected, (state, action) => {
        state.getAvailableSlotsLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllPharmacies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPharmacies.fulfilled, (state, action) => {
        state.loading = false;
        state.pharmacies = action.payload?.data;
      })
      .addCase(fetchAllPharmacies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Medical Record
    builder.addCase(createPrescription.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPrescription.fulfilled, (state, action) => {
      state.loading = false;
      state.message =
        action.payload.message || "Medical record created successfully!";
      state.success = action?.payload?.success;
    });
    builder.addCase(createPrescription.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = "Failed to create medical record";
      state.success = false;
    });
  },
});

export const {
  resetAppointmentState,
  resetSelectedAppointment,
  selectedAppointment,
  resetAppointmentsList,
  resetCreateAppointment,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
