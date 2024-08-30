import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles/styles';

export default function Settings() {
  const navigator = useNavigation();

  return (
    <View style={[styles.flex, styles.background]}>

      <TouchableOpacity style={styles.button} onPress={() => {
        // TODO: fix this
        navigator.navigate('Home' as never);
      }}>
        <Text style={styles.text}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}