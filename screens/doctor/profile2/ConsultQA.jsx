import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';

const ConsultQA = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/free-questionnaire-1535669-1309490.png' }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>
        No query answered by this doctor. Get answers to your health queries now
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => {/* handle ask question action */}}>
        <Text style={styles.buttonText}>Ask Free Question</Text>
      </TouchableOpacity>
      <View style={styles.linkContainer}>
        <Text style={styles.link} onPress={() => Linking.openURL('#')}>
          Report an Error
        </Text>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    alignItems: 'center',
    // margin: 10,
  },
  image: {
    width: 80,
    height: 80,
    opacity: 0.4,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#198754', // bootstrap success green
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  linkContainer: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  link: {
    color: '#6c757d',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});

export default ConsultQA;