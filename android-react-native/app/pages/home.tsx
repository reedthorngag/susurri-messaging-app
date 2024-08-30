import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function Home() {
  const navigator = useNavigation();

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.button} onPress={() => {
        logout
        // TODO: fix this
        navigator.navigate('Welcome' as never);
      }}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}