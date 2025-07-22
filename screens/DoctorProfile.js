// import React, { useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchDoctorProfile } from '../redux/slices/doctorSlice';
// import { Ionicons, FontAwesome,MaterialIcons ,MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons';

import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

// const DoctorAvailability = ({ doctorId }) => {
//   const dispatch = useDispatch();
//   const { profile, loading, error } = useSelector((state) => state.doctor);

//   useEffect(() => {
//     dispatch(fetchDoctorProfile(doctorId));
//   }, [dispatch, doctorId]);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text>Error: {error}</Text>
//       </View>
//     );
//   }

//   if (!profile) {
//     return null;
//   }

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
//       <View style={styles.profileHeader}>
//         <Image source={{ uri: profile?.profileImageUrl }} style={styles.profileImage} />
//         <View style={styles.profileDetails}>
//           <Text style={styles.name}>{profile.name}</Text>
//       {/* gender and age */}
//           <View style={styles.detailsRow}>
//             <Ionicons name="person-outline" size={16} color="#007bff" />
//             <Text style={styles.detailText}>
//               {profile.gender}, {profile.age} Years
//             </Text>
//           </View>
//       {/* languagaes */}
//           <View style={styles.detailsRow}>
//             <MaterialIcons name="language" size={18} color="#007bff" />
//             <Text style={styles.detailText}>
//               Languages: {profile.languages.join(', ')}
//             </Text>
//           </View>
//           {/* specialization */}
//           <View style={styles.detailsRow}>
//             <MaterialIcons name="local-hospital" size={18} color="#007bff" />
//             <Text style={styles.detailText}>{profile.specialization}</Text>
//           </View>
//           {/* Education */}
//           {/* <View style={styles.detailsRow}>
//             <MaterialCommunityIcons name="school" size={18} color="#007bff" />
//             <Text style={styles.detailText}>{profile.qualifications}</Text>
//           </View> */}

//           {/* Patient Stories */}
//           <View style={styles.detailsRow}>
//             <Text style={styles.detailText}>
//               <FontAwesome name="heart" size={16} color="#007bff" /> {profile.patientSatisfaction}% Recommend{' '}

//             </Text>
//           </View>
//           <View style={styles.detailsRow}>
//           <MaterialIcons name="people" size={16} color="#007bff" />
//             <Text style={styles.detailText}>
//           {profile.patientStories} Patient Stories
//             </Text>
//           </View>

//         </View>
//       </View>

//       <View style={styles.clinicContainer}>
//         <Text style={styles.clinicName}>Education</Text>
//         <Text style={{marginBottom:5}}> <MaterialIcons name="school" size={16} color="#007bff" /> {profile.qualifications}</Text>
//         <Text style={styles.clinicName}>Experience</Text>
//         <Text  > <MaterialIcons name="work" size={16} color="#007bff" /> {profile.experience}</Text>
//         {/* <Text style={styles.waitTime}><MaterialIcons name="access-time" size={16} color="#007bff" /> Max. {profile.maxWaitTime} wait + Verified Details</Text> */}
//       </View>
//       {/* <View style={styles.clinicContainer}>
//         <Text style={styles.clinicName}>Experience</Text>
//         <Text> <MaterialIcons name="location-on" size={16} color="#007bff" /> {profile.experience}</Text>

//       </View> */}
//       <View style={styles.clinicContainer}>
//         <Text style={styles.clinicName}>{profile.clinicName}</Text>
//         <Text> <MaterialIcons name="location-on" size={16} color="#007bff" /> {profile.clinicAddress}</Text>
//         <Text style={styles.waitTime}><MaterialIcons name="access-time" size={16} color="#007bff" /> Max. {profile.maxWaitTime} wait + Verified Details</Text>
//       </View>

//       <View style={styles.slotsSection}>
//         <Text style={styles.slotsHeader}>
//           Today {profile.slotsToday ? profile.slotsToday.length : 0} slots Tomorrow {profile.slotsTomorrow} slots 20 Mar
//         </Text>
//         <View style={styles.slotsContainer}>
//           {profile.slotsToday &&
//             profile.slotsToday.map((slot, index) => (
//               <TouchableOpacity key={index} style={styles.slotButton}>
//                 <Text>{slot}</Text>
//               </TouchableOpacity>
//             ))}
//         </View>
//         <TouchableOpacity style={styles.viewAllSlotsButton}>
//           <Text style={styles.viewAllSlotsText}>View all Slots</Text>
//         </TouchableOpacity>
//       </View>
//   {/* Awards */}
//   <View style={styles.friendlinessSection}>
//         <Text style={styles.friendlinessHeader}>Doctor Friendliness</Text>
//         <Text style={styles.friendlinessText}>
//           <FontAwesome name="thumbs-up" size={16} color="#007bff" /> {profile.doctorFriendliness}% patients find the doctor friendly and approachable
//         </Text>
//       </View>

//       <View style={styles.awardSection}>
//         <Text style={styles.awardHeader}>Awards</Text>
//         {profile.awards.map((award, index) => (
//           <Text key={index} style={styles.awardText}>
//             <FontAwesome name="trophy" size={16} color="#FFD700" /> {award}
//           </Text>
//         ))}
//       </View>

//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 20,
//       backgroundColor: '#f9f9f9', // Light background
//     },
//     scrollContent: {
//       paddingBottom: 80, // Adjust this value as needed
//     },
//     profileHeader: {
//       flexDirection: 'row',
//       alignItems: 'flex-start',
//       marginBottom: 15,
//       backgroundColor: 'white',
//       padding:10,
//       borderRadius: 8,
//     },
//     profileImage: {
//       width: 100,
//       height: 100,
//       borderRadius: 8,
//       marginRight: 15,
//       marginTop:15,
//     },
//     profileDetails: {
//       flex: 1,
//     },
//     name: {
//       fontSize: 22,
//       fontWeight: 'bold',
//       marginBottom: 5,
//     },
//     specialization: {
//       fontSize: 16,
//       color: '#333',
//       marginBottom: 3,
//     },
//     qualifications: {
//       fontSize: 14,
//       color: '#666',
//       marginBottom: 3,
//     },
//     experience: {
//       fontSize: 14,
//       color: '#666',
//       marginBottom: 8,
//     },
//     statsContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom:8,
//     },
//     statsText: {
//       fontSize: 14,
//       color: '#333',
//     },
//     fee: {
//       fontSize: 16,
//       fontWeight: 'bold',
//       color: '#007bff', // Blue color
//     },
//     clinicContainer: {
//       backgroundColor: 'white',
//       padding: 15,
//       borderRadius: 8,
//       marginBottom: 15,
//     },
//     clinicName: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginBottom: 5,
//     },
//     waitTime: {
//       color: '#666',
//       marginTop:5,
//     },
//     slotsSection: {
//       backgroundColor: 'white',
//       padding: 15,
//       borderRadius: 8,
//       marginBottom: 15,
//     },
//     slotsHeader: {
//       fontWeight: 'bold',
//       marginBottom: 10,
//     },
//     slotsContainer: {
//       flexDirection: 'row',
//       flexWrap: 'wrap',
//       marginBottom: 10,
//     },
//     slotButton: {
//       backgroundColor: '#e0e0e0',
//       paddingVertical: 8,
//       paddingHorizontal: 12,
//       borderRadius: 5,
//       margin: 5,
//     },
//     viewAllSlotsButton: {
//       alignSelf: 'flex-start',
//     },
//     viewAllSlotsText: {
//       color: '#007bff',
//     },
//     friendlinessSection: {
//       backgroundColor: 'white',
//       padding: 15,
//       borderRadius: 8,
//       marginBottom: 15,
//     },
//     friendlinessHeader: {
//       fontWeight: 'bold',
//       marginBottom: 5,
//     },
//     friendlinessText: {
//       color: '#333',
//     },
//     buttonContainer: {
//       flexDirection: 'row',
//       justifyContent: 'space-around',
//     },
//     bookButton: {
//       backgroundColor: '#007bff',
//       paddingVertical: 12,
//       paddingHorizontal: 20,
//       borderRadius: 8,
//     },
//     callButton: {
//       backgroundColor: '#28a745',
//       paddingVertical: 12,
//       paddingHorizontal: 20,
//       borderRadius: 8,
//     },
//     buttonText: {
//       color: 'white',
//       fontWeight: 'bold',
//     },
//     detailsRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 5,
//     },
//     detailText: {
//       marginLeft: 5,
//       color: '#666',
//     },
//     awardSection: {
//       backgroundColor: 'white',
//       padding: 15,
//       borderRadius: 8,
//       marginBottom: 15,
//       paddingBottom: 20,
//     },
//     awardHeader: {
//       fontWeight: 'bold',
//       marginBottom: 5,
//       color: '#333',
//     },
//     awardText: {
//       color: '#333',
//       marginBottom: 5,
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     friendlinessSection: {
//       backgroundColor: 'white',
//       padding: 15,
//       borderRadius: 8,
//       marginBottom: 15,
//       alignItems: 'center', // Center content horizontally
//     },
//     friendlinessHeader: {
//       fontWeight: 'bold',
//       marginBottom: 10,
//       color: '#333',
//       fontSize: 18, // Slightly larger font for the header
//     },
//     friendlinessText: {
//       color: '#333',
//       fontWeight: 'bold',
//       fontSize: 16, // Slightly larger font for the text
//       textAlign: 'center', // Center align the text
//       marginTop: 5,
//     },
//     friendlinessPercentage: {
//       fontSize: 24, // Make the percentage larger
//       color: '#28a745', // Green color for emphasis
//       fontWeight: 'bold',
//     },
//     friendlinessIconAndText: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'center',
//       marginBottom: 5,
//     },
//   });

// export default DoctorAvailability;

// import React, { useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
//   Image,
// } from "react-native";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchDoctorProfile } from "../redux/slices/doctorSlices";

const DoctorProfile = ({ doctorId }) => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(fetchDoctorProfile(doctorId));
  }, [dispatch, doctorId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: profile.profileImageUrl }}
          style={styles.profileImage}
        />
        <View style={styles.profileDetails}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text>Age: {profile.age}</Text>
          <Text>Gender: {profile.gender}</Text>
          <Text>Review: {profile.reviewPercentage}%</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Education</Text>
      <Text>{profile.education}</Text>

      <Text style={styles.sectionTitle}>Experience</Text>
      <Text>{profile.experience}</Text>

      <Text style={styles.sectionTitle}>Awards</Text>
      {profile.awards.map((award, index) => (
        <Text key={index}>- {award}</Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  profileDetails: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
});

export default DoctorProfile;

// import React, { useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchDoctorProfile } from '../redux/slices/doctorSlices';

// const DoctorProfile = ({ doctorId }) => {
//   const dispatch = useDispatch();
//   const { profile, loading, error } = useSelector((state) => state.doctor);

//   useEffect(() => {
//     dispatch(fetchDoctorProfile(doctorId));
//   }, [dispatch, doctorId]);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text>Error: {error}</Text>
//       </View>
//     );
//   }

//   if (!profile) {
//     return null;
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.profileHeader}>
//         <Image source={{ uri: profile.profileImageUrl }} style={styles.profileImage} />
//         <View style={styles.profileDetails}>
//           <Text style={styles.name}>{profile.name}</Text>
//           <Text style={styles.specialization}>{profile.specialization}</Text>
//           <Text style={styles.qualifications}>{profile.qualifications}</Text>
//           <Text style={styles.experience}>{profile.experience}</Text>
//         </View>
//       </View>
//       {/* <View style={styles.statsContainer}>
//         <Text>
//           {profile.patientSatisfaction}% {profile.patientStories} Patient Stories
//         </Text>
//       </View> */}
//       {/* <Text style={styles.fee}>₹{profile.appointmentFee} fees</Text> */}
//       {/* <View style={styles.clinicContainer}>
//         <Text style={styles.clinicName}>{profile.clinicName}</Text>
//         <Text>{profile.clinicAddress}</Text>
//         <Text>Max. {profile.maxWaitTime} wait + Verified Details</Text>
//       </View>
//       */}

//       {/* <Text style={styles.friendliness}>Doctor Friendliness</Text>
//       <Text>{profile.doctorFriendliness}% patients find the doctor friendly and approachable</Text> */}

//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   profileHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50, // Circular image
//     marginRight: 15,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   // ... other styles
//   slotsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 10,
//   },
//   slotButton: {
//     backgroundColor: '#e0e0e0',
//     padding: 10,
//     margin: 5,
//     borderRadius: 5,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 20,
//   },
//   bookButton: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//   },
//   callButton: {
//     backgroundColor: 'green',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText:{
//     color:'white'
//   },
//   friendliness:{
//     marginTop:10,
//     fontWeight:'bold'
//   },
//   fee:{
//     marginTop:10,
//     fontWeight:'bold'
//   },
//   clinicContainer:{
//     marginTop:10,
//   },
//   clinicName:{
//     fontWeight:'bold'
//   },
//   statsContainer:{
//     marginTop:5,
//     marginBottom:5,
//   }
// });

// export default DoctorProfile;
