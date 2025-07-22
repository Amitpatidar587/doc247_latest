import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app_common/auth/api";

// Add Favorite
export const AddFavorite = createAsyncThunk(
  "patient/AddFavorite",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/favorite/`, { ...data });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch patient details"
      );
    }
  }
);

// Delete Favorite
export const deleteFavorite = createAsyncThunk(
  "favorite/deleteFavorite",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/favorite/`, {
        params: { ...data },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete favorite"
      );
    }
  }
);

// Get Favorites
export const fetchFavorites = createAsyncThunk(
  "favorite/fetchFavorites",
  async ({ patient_id }, { rejectWithValue }) => {
    try {
      const response = await api.get("/favorite/", { params: { patient_id } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to get favorites");
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    favorites: [],
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    resetFavorite: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddFavorite.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(AddFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFavorite.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deleteFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload.data;
        state.success = true;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;
