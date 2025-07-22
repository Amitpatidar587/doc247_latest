// store/slices/videoCallSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  incomingCall: null,
  receiverData: null,
  callStatus: "idle", // idle | incoming | connecting | accepted | rejected | missed | failed | ended | busy
  showCallModal: false,
  isCaller: false,
  error: null, // Optional: useful for showing reason
};

const videoCallSlice = createSlice({
  name: "videoCall",
  initialState,
  reducers: {
    initiateCall: (state, action) => {
      state.receiverData = action.payload?.data;
      state.callStatus = "connecting";
      state.showCallModal = true;
      state.isCaller = true;
      state.error = null;
    },
    receiveCall: (state, action) => {
      console.log("Receiving call:", action.payload);
      state.incomingCall = action.payload;
      state.callStatus = "incoming";
      state.showCallModal = true;
      state.isCaller = false;
      state.error = null;
    },
    acceptCall: (state, action) => {
      state.callStatus = "accepted";
      state.acceptedData = action.payload;
      state.error = null;
    },
    rejectCall: (state, action) => {
      state.callStatus = "rejected";
      state.error = action.payload || null;
    },
    missedCall: (state, action) => {
      state.callStatus = "missed";
      state.error = action.payload || "User did not answer";
    },
    failCall: (state, action) => {
      state.callStatus = "failed";
      state.error = action.payload || "Call could not be completed";
    },
    endCall: (state, action) => {
      state.callStatus = "ended";
      state.error = action.payload || null;
    },
    busyCall: (state, action) => {
      state.callStatus = "busy";
      state.error = action.payload || "User is busy";
    },
    hideCallModal: (state) => {
      state.callStatus = "idle";
      state.incomingCall = null;
      state.receiverData = null;
      state.showCallModal = false;
      state.isCaller = false;
      state.error = null;
    },
  },
});

export const {
  initiateCall,
  receiveCall,
  acceptCall,
  rejectCall,
  missedCall,
  failCall,
  endCall,
  busyCall,
  hideCallModal,
} = videoCallSlice.actions;

export default videoCallSlice.reducer;
