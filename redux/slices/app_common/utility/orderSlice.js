import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../auth/api";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async ({ patientId }, { rejectWithValue }) => {
    try {
      const params = {
        patient_id: patientId,
      };
      const response = await api.get("/pharmacy/order/", {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/pharmacy/order/${orderId}/`, {
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update order status"
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/pharmacy/order/${orderId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete order");
    }
  }
);

export const fetchPrescription = createAsyncThunk(
  "orders/fetchPrescription",
  async ({ id, appointment_id }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/prescription/`, {
        params: {
          prescription_group_id: id,
          appointment_id: appointment_id,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch prescription"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    resetOrderstate: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload?.data;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.prescription = action.payload?.data;
      })
      .addCase(fetchPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderstate } = orderSlice.actions;

export default orderSlice.reducer;
