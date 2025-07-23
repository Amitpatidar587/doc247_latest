
import PatientBasicDetails from "./profile/PatientBasicDetails";
import ChangePasswordScreen from "../doctor/profile/ChangePasswordScreen";
import TabbedScreen from "../../components/navigation/TabbedScreen";
import PatientMedicalRecords from "./profile/PatientMedicalRecord";
import PatientVitals from "./profile/PatientVitals";

const PatientProfile = () => {
  const tabs = [
    { name: "Basic Details", component: <PatientBasicDetails /> },
    { name: "Medical Records", component: <PatientMedicalRecords /> },
    { name: "Vitals", component: <PatientVitals /> },
    { name: "Change Password", component: <ChangePasswordScreen /> },
    // { name: "Video Call", component: <VideosCall /> },
  ];



  return (
    <TabbedScreen
      tabs={tabs}
      // headerComponent={<ProfileCard userData={patient} onLogOut={onLogout} />}
    />
  );
};

export default PatientProfile;
