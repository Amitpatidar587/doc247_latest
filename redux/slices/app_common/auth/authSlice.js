import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";
import { saveTokens } from "./authService";

// 🔹 Login
export const logIn = createAsyncThunk(
  "auth/logIn",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/login/", credentials);
      // console.log(res);

      if (res.data.access) {
        const { access_token, refresh_token } = res.data.data;
        await saveTokens({ access: access_token, refresh: refresh_token });
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.message || "Login failed");
    }
  }
);

// 🔹 Signup
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/signup/", userData);
      // console.log(res);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/verify-otp/`, { email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/forget_password/",
        { email },
        { noAuth: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Request failed");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, uid, data }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/resetpassword/${uid}/${token}/`, {
        ...data,
        noAuth: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ data }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/change_password/`, {
        ...data,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  }
);

// // 🔹 Logout
// export const logOut = createAsyncThunk("auth/logOut", async () => {
//   await clearTokens();
// });

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    isLoggedIn: false,
    userRole: null,
    isOtpVerified: false,
    message: null,
    userId: null,
    senderId: null,
    healthId: null,
  },
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
    logOut: (state) => {
      state.isLoggedIn = false;
      state.userRole = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(logIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload?.data?.specific_id;
        state.user = action.payload?.data?.user;
        state.senderId = action.payload?.data?.user?.id;
        state.healthId = action.payload?.data?.health_id;
        state.userRole = action.payload?.data?.user?.user_type;
        state.message = action.payload.message;
        state.success = action.payload.success;
        if (action.payload.success) {
          state.isLoggedIn = true;
        }
      })
      .addCase(logIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "something went wrong";
      })

      // Signup
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.message = "something went wrong";
        state.loading = false;
        // state.success = true
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isOtpVerified = true;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message = "something went wrong";
      })

      // Forget Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message = "something went wrong";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.message = "something went wrong";
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    // Logout
  },
});

export const { resetAuthState, logOut } = authSlice.actions;

export default authSlice.reducer;
