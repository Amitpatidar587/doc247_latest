import TabbedScreen from "../../../components/navigation/TabbedScreen";
import ExperienceScreen from "./Experience";
import EducationScreen from "./Education";
import Award from "./Award";
import DoctorBasicDetails from "./DoctorBasicDetails";

import ChangePasswordScreen from "./ChangePasswordScreen";
// import DoctorPatientChat from "../../DoctorPatientChat";
// import JitsiDoctorMeeting from "../../common/JitsiMeetingScreen";
// import VideosCall from "../../common/VideosCall";
// import ChatListScreen from "../../common/chat/Chatlist";
// import DoctorProfile from "./DoctorProfile";

const ProfileScreen = () => {
  const tabs = [
    { name: "Basic Details", component: <DoctorBasicDetails /> },
    { name: "Experience", component: <ExperienceScreen /> },
    { name: "Education", component: <EducationScreen /> },
    { name: "Awards", component: <Award /> },
    { name: "Change Password", component: <ChangePasswordScreen /> },
    // { name: "Video Call", component: <VideosCall /> },
    // { name: "Chat", component: <ChatListScreen /> },
  ];

  return (
    <TabbedScreen
      tabs={tabs}
      // headerComponent={<ProfileCard userData={doctor} onLogOut={onLogout} />}
    />
  );
};

export default ProfileScreen;
