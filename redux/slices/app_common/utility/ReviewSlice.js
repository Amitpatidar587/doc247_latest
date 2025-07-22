import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../auth/api";

// Fetch reviews
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async ({ targetId, targetType, appointmentId , page, page_size }, { rejectWithValue }) => {
    try {
      const params = {
        target_id: targetId || "",
        target_type: targetType || "",
        appointment_id: appointmentId || "",
        page: page,
        page_size: page_size,
      };
      const response = await api.get("/review/", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch reviews");
    }
  }
);

export const fetchReviewById = createAsyncThunk(
  "reviews/fetchReviewById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/review/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch review");
    }
  }
);

// Add a review
export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post("/review/", { ...reviewData });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add review");
    }
  }
);

// Update a review
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/review/${id}/`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update review");
    }
  }
);

// Delete a review
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/review/${id}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete review");
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
    review: null,
    success: false,
    message: null,
    reviewId: null,
  },
  reducers: {
    resetReview: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.pagination = action.payload.pagination;

        // Check if we're appending or replacing
        const isAppend = action.meta?.arg?.append;

        if (isAppend) {
          state.reviews = [...state.reviews, ...action.payload.data];
        } else {
          state.reviews = action.payload.data;
        }
      })

      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchReviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.review = action.payload;
      })

      .addCase(fetchReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })

      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReview } = reviewsSlice.actions;

export default reviewsSlice.reducer;
