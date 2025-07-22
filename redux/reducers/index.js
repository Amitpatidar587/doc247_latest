import { combineReducers } from "redux";
import authReducer from "../slices/app_common/auth/authSlice";
import themeReducer from "../slices/app_common/utility/themeSlice";
import patientReducer from "../slices/patient/patientSlice";
import doctorReducer from "../slices/doctor/doctorSlice";
import appointmentsReducer from "../slices/app_common/AppointmentSlice";
import availabilityReducer from "../slices/doctor/doctorutility/availabilitySlice";
import experienceReducer from "../slices/doctor/profile/experienceSlice";
import educationReducer from "../slices/doctor/profile/educationSlice";
import awardsReducer from "../slices/doctor/profile/awardsSlice";
import requiredReducer from "../slices/app_common/required/RequiredSlice";
import reviewsReducer from "../slices/app_common/utility/ReviewSlice";
import orderReducer from "../slices/app_common/utility/orderSlice";
import favoriteReducer from "../slices/patient/favoriteSlice";
import vitalsReducer from "../slices/patient/profile/vitalsSlice";
import chatReducer from "../slices/app_common/utility/chatSlice";
import videoCallReducer from "../slices/app_common/utility/videoCallSlice";
import notificationReducer from "../slices/app_common/utility/notificationSlice";
import medicalRecordReducer from "../slices/patient/profile/medicalRecordSlice";

const appReducer = combineReducers({
  auth: authReducer,
  doctor: doctorReducer,
  patient: patientReducer,
  theme: themeReducer,
  appointment: appointmentsReducer,
  availability: availabilityReducer,
  experience: experienceReducer,
  education: educationReducer,
  award: awardsReducer,
  required: requiredReducer,
  review: reviewsReducer,
  order: orderReducer,
  favorite: favoriteReducer,
  vital: vitalsReducer,
  chat: chatReducer,
  video: videoCallReducer,
  notification: notificationReducer,
  medical: medicalRecordReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logOut") {
    // Clear all state on logout (preserve theme if you want by excluding it)
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
