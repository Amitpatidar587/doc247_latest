import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Modal, Button} from 'react-native';
import {
  fetchDoctors,
  resetsearchQuery,
} from '../../../redux/slices/doctor/doctorSlice';
import {useDispatch, useSelector} from 'react-redux';
import DoctorSearchInput from '../../common/DoctorSearchInput';
import {
  AddFavorite,
  deleteFavorite,
  resetFavorite,
} from '../../../redux/slices/patient/favoriteSlice';
import {DoctorCard} from './DoctorCard';
import {useToast} from '../../../components/utility/Toast';

const DoctorSearch = ({navigation, route}) => {
  const [filterVisible, setFilterVisible] = useState(false);
  const {isonline} = route?.params || {isonline: false}; // Default to false if not provided
  const {userId} = useSelector(state => state.auth);
  const {doctorsList, search} = useSelector(state => state.doctor);
  const {success, message, error} = useSelector(state => state.favorite);
  const [searchQuery, setSearchQuery] = useState(search || '');
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 10,
    appointment_date: '',
    visit_type: '',
    appointment_type: '',
  });
  const dispatch = useDispatch();
  const {showToast} = useToast();
  // console.log(isonline === true);

  const getDoctors = useCallback(async () => {
    const ldf = isonline === true ? {is_online: true} : {};
    const queryParams = {
      search: searchQuery,
      ...filters,
      ...ldf,
      page: 1,
      page_size: 10,
      patient_id: userId,
    };
    try {
      await dispatch(fetchDoctors(queryParams));
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  }, [dispatch, filters, searchQuery, userId, isonline]);

  // Fetch doctors when component mounts
  useEffect(() => {
    getDoctors();
  }, [getDoctors]); // Empty dependency array means this runs once when component mounts

  // Fetch doctors when search changes
  useEffect(() => {
    if (search) {
      getDoctors();
      dispatch(resetsearchQuery());
    }
  }, [search, dispatch, getDoctors]);

  const handleSearch = () => {
    getDoctors();
  };

  const handleSearchChange = text => {
    setSearchQuery(text);
  };

  // const handleFilterChange = (field, value) => {
  //   setFilters(prevFilters => ({
  //     ...prevFilters,
  //     [field]: value,
  //   }));
  // };

  useEffect(() => {
    if (message === null) {
      return;
    }
    showToast(message, success ? 'success' : 'error');
    dispatch(resetFavorite());
    getDoctors();
  }, [message, success, error, dispatch, getDoctors, showToast]);

  const handleFavorite = id => {
    const data = {
      doctor_id: id,
      patient_id: userId,
    };
    dispatch(AddFavorite(data));
  };

  const handleDelete = id => {
    const data = {
      doctor_id: id,
      patient_id: userId,
    };
    dispatch(deleteFavorite({data}));
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <DoctorSearchInput
          handleSearch={handleSearch}
          search={searchQuery}
          handleChange={handleSearchChange}
        />
      </View>
      <FlatList
        data={doctorsList}
        renderItem={({item}) => (
          <DoctorCard
            doctor={item}
            onFavorite={handleFavorite}
            onDeleteFavorite={handleDelete}
            isonline={isonline}
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.doctorList}
        scrollEventThrottle={16}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No doctors found</Text>
          </View>
        )}
      />

      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            <Button title="Close" onPress={() => setFilterVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    marginBottom: 50,
  },
  searchBarContainer: {
    backgroundColor: '#e9ecef',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  doctorList: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default DoctorSearch;
