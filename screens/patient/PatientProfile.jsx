import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/slices/app_common/auth/authSlice";
import PatientBasicDetails from "./profile/PatientBasicDetails";
import ChangePasswordScreen from "../doctor/profile/ChangePasswordScreen";
import TabbedScreen from "../../components/navigation/TabbedScreen";
import ProfileCard from "../../components/ProfileCard";
import { clearTokens } from "../../redux/slices/app_common/auth/authService";
import PatientMedicalRecords from "./profile/PatientMedicalRecord";
import PatientVitals from "./profile/PatientVitals";
import VideosCall from "../common/VideosCall";

const PatientProfile = () => {
  const { patient } = useSelector((state) => state.patient);
  const dispatch = useDispatch();

  const tabs = [
    { name: "Basic Details", component: <PatientBasicDetails /> },
    { name: "Medical Records", component: <PatientMedicalRecords /> },
    { name: "Vitals", component: <PatientVitals /> },
    { name: "Change Password", component: <ChangePasswordScreen /> },
    // { name: "Video Call", component: <VideosCall /> },
  ];

  const onLogout = async () => {
    console.log("Logging out...");
    await clearTokens();
    dispatch(logOut());
  };
  

  return (
    <TabbedScreen
      tabs={tabs}
      // headerComponent={<ProfileCard userData={patient} onLogOut={onLogout} />}
    />
  );
};

export default PatientProfile;
