// redux/Slices/awardsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../app_common/auth/api";

export const fetchAwards = createAsyncThunk(
  "awards/fetchAwards",
  async (params = {}) => {
    const response = await api.get("/award/", {
      params,
    });
    // Return the entire response data structure
    return response.data;
  }
);

export const fetchAward = createAsyncThunk("awards/fetchAward", async (id) => {
  const response = await api.get(`/award/${id}/`);
  return response.data;
});

export const addAward = createAsyncThunk(
  "awards/addAward",
  async (awardData) => {
    const response = await api.post("/award/", awardData);
    return response.data;
  }
);

export const updateAward = createAsyncThunk(
  "awards/updateAward",
  async ({ id, award }) => {
    const response = await api.put(`/award/${id}/`, award);
    return response.data;
  }
);

export const deleteAward = createAsyncThunk(
  "awards/deleteAward",
  async (id) => {
    const response = await api.delete(`/award/${id}/`);
    return response.data;
  }
);

const awardsSlice = createSlice({
  name: "awards",
  initialState: {
    awards: [],
    error: null,
    success: false,
    message: null,
    loading: false,
  },
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
      state.message = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAwards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAwards.fulfilled, (state, action) => {
        // Extract the results array from the response
        state.awards = action.payload.data || [];
        state.loading = false;
      })
      .addCase(fetchAwards.rejected, (state, action) => {
        state.success = false;
        state.error = action.error.message;
        state.loading = false;
      })

      .addCase(addAward.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAward.fulfilled, (state, action) => {
        state.success = action?.payload?.success;
        state.message = action?.payload?.message;
        state.loading = false;
      })

      .addCase(addAward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateAward.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateAward.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.loading = false;
      })

      .addCase(deleteAward.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAward.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.loading = false;
      })

      .addCase(deleteAward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetSuccess } = awardsSlice.actions;

export default awardsSlice.reducer;
