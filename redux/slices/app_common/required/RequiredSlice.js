import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../auth/api";

export const fetchFilters = createAsyncThunk(
  "filters/fetchFilters",
  async (params = {}) => {
    const response = await api.get("/filter/", {
      params,
    });
    // Return the entire response data structure
    return response.data;
  }
);

export const fetchFilter = createAsyncThunk(
  "filters/fetchFilter",
  async (id) => {
    const response = await api.get(`/filter/${id}/`);
    return response.data;
  }
);

export const fetchFiltername = createAsyncThunk(
  "filters/fetchFiltername",
  async (payload) => {
    const response = await api.get(`/filter/name/`, {
      params: { filter_name: payload },
    });
    return response.data;
  }
);

const requiredSlice = createSlice({
  name: "required",
  initialState: {
    requiredFields: [],
  },
  reducers: {
    resetFilters: (state, action) => {
      state.requiredFields = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.filters = action.payload?.data;
      })
      .addCase(fetchFilter.fulfilled, (state, action) => {
        state.requiredFields = action.payload?.data;
      })
      .addCase(fetchFiltername.fulfilled, (state, action) => {
        state.requiredFields = action.payload?.data[0]?.filter_json;
      });
    //   .addCase(fetchFilters.rejected, (state, action) => {
    //     state.requiredFields = [];
    //   })
    //   .addCase(fetchFilter.rejected, (state, action) => {
    //     state.requiredFields = [];
    //   })
    //   .addCase(fetchFiltername.rejected, (state, action) => {
    //     state.requiredFields = [];
    //   })

    //   .addCase(fetchFilters.pending, (state, action) => {
    //     state.requiredFields = [];
    //   })
    //   .addCase(fetchFilter.pending, (state, action) => {
    //     state.requiredFields = [];
    //   })
    //   .addCase(fetchFiltername.pending, (state, action) => {
    //     state.requiredFields = [];
    //   });
  },
});

export const { setRequiredFields } = requiredSlice.actions;
export default requiredSlice.reducer;
