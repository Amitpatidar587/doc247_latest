import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../auth/api";

const CHAT_URL = "/chat/";
const CHAT_LIST_URL = "/chat/chat_list/";
// Fetch all chat data (without specifying a chat ID)
export const fetchAllChats = createAsyncThunk(
  "chats/fetchAllChats",
  async (payload, { rejectWithValue }) => {
    // console.log("Fetching all chats for sender_id:", payload);
    try {
      const response = await api.post(CHAT_LIST_URL, {
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

// Get a Chat by ID
export const fetchChatById = createAsyncThunk(
  "chats/fetchChatById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(CHAT_URL, {
        action: "getChatData",
        id,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch chat");
    }
  }
);

// Create a New Chat
export const createChat = createAsyncThunk(
  "chats/createChat",
  async (chatData, { rejectWithValue }) => {
    try {
      const {
        sender_id,
        sender_type,
        receiver_id,
        receiver_type,
        message,
        file_url,
        is_read,
      } = chatData;

      const payload = {
        action: "saveChatData",
        sender_id,
        sender_type,
        receiver_id,
        receiver_type,
        message,
        file_url,
        is_read,
      };
      const response = await api.post(CHAT_URL, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create chat");
    }
  }
);

// Update Chat
export const updateChat = createAsyncThunk(
  "chats/updateChat",
  async ({ chatData }, { rejectWithValue }) => {
    try {
      const response = await api.put(CHAT_URL, {
        ...chatData,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update chat");
    }
  }
);

// Delete Chat
export const deleteChat = createAsyncThunk(
  "chats/deleteChat",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${CHAT_URL}/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete chat");
    }
  }
);

// Get Last Chat Messages
export const fetchLastChats = createAsyncThunk(
  "chats/fetchLastChats",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/chat/get_last_chat/", {
        ...payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch last chats"
      );
    }
  }
);

// Get Chat History
export const fetchChatHistory = createAsyncThunk(
  "chats/fetchChatHistory",
  async ({ user1_id, user2_id, page, page_size }, { rejectWithValue }) => {
    try {
      const response = await api.post("/chat/chat_history/", {
        action: "history",
        user1_id,
        user2_id,
        page,
        page_size,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch chat history"
      );
    }
  }
);

// Slice
const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chats: [],
    activeChat: null,
    history: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    selectedChatUser: (state, action) => {
      state.selectedChatUser = action.payload;
    },
    clearSelectedChatUser: (state) => {
      state.selectedChatUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload?.data;
      })
      .addCase(fetchAllChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchChatById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatById.fulfilled, (state, action) => {
        state.activeChat = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(createChat.pending, (state) => {
        state.loading = true;
      })

      .addCase(createChat.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateChat.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateChat.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
      })
      .addCase(updateChat.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteChat.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteChat.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchLastChats.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchLastChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chatUsers = action.payload?.data;
        state.unread_count = action.payload?.total_unread_count;
      })
      .addCase(fetchLastChats.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;

        const newMessages = action.payload?.data || [];
        const page = action.meta.arg?.page || 1;

        if (page === 1) {
          state.history = newMessages;
        } else {
          const existingIds = new Set(state.history.map((msg) => msg.id));
          const uniqueNewMessages = newMessages.filter(
            (msg) => !existingIds.has(msg.id)
          );
          state.history = [...uniqueNewMessages, ...state.history];
        }

        // Store pagination
        state.pagination = action.payload?.pagination || null;
      })

      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetError, selectedChatUser, clearSelectedChatUser } =
  chatSlice.actions;
export default chatSlice.reducer;
