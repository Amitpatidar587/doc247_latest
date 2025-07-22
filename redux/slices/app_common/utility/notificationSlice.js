import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../auth/api.js";

// Fetch all chat data (without specifying a chat ID)
export const SendNotification = createAsyncThunk(
  "notifications/SendNotification",
  async (payload, { rejectWithValue }) => {
    // console.log("send notification:", payload);
    try {
      const response = await api.post("/firebase/", {
        ...payload,
      });
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to send notification"
      );
    }
  }
);

export const fetchAllNotifications = createAsyncThunk(
  "notifications/fetchAllNotifications",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("notification/getNotification/", {
        ...payload,
      });
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications"
      );
    }
  }
);

export const fetchUnreadNotifications = createAsyncThunk(
  "notifications/fetchUnreadNotifications",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("notification/getUnreadNotification/", {
        ...payload,
      });
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications"
      );
    }
  }
);

export const updateNotification = createAsyncThunk(
  "notifications/updateNotification",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.put("notification/updateNotification/", {
        ...payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications"
      );
    }
  }
);

export const ConnectCall = createAsyncThunk(
  "notifications/ConnectCall",
  async (payload, { rejectWithValue }) => {
    // console.log("connect call:", payload);
    try {
      const response = await api.post("/call_connect/", {
        ...payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch all chats"
      );
    }
  }
);

// Slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    notificationsCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
      state.message = null;
      state.success = null;
      state.loading = false;
    },
    selectedChatUser: (state, action) => {
      state.selectedChatUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SendNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SendNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(SendNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.pagination = action.payload?.pagination;
        const currentPage = action.meta.arg?.page || 1;
        if (currentPage > 1) {
          state.notifications = [
            ...state.notifications,
            ...action.payload?.data,
          ];
        } else {
          state.notifications = action.payload?.data;
        }
      })
      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.notificationsCount = action?.payload?.total_unread;
        state.success = action.payload?.success;
      })
      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(ConnectCall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ConnectCall.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(ConnectCall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, selectedChatUser } = notificationSlice.actions;
export default notificationSlice.reducer;
