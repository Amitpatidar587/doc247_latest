import React, { useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../../redux/slices/patient/favoriteSlice";
import { DoctorCard } from "../Home/DoctorCard";
import { useFocusEffect } from "@react-navigation/native";
import { Text } from "react-native-paper";

const Favorite = () => {
  const { favorites } = useSelector((state) => state.favorite);
  const { userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchFavorites({ patient_id: userId }));
    }, [dispatch, userId])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Doctors</Text>
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            // onFavorite={handleFavorite}
            // onDeleteFavorite={handleDelete}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#212529",
  },
  listContent: {
    gap: 12,
  },
});

export default Favorite;
