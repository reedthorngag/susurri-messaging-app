import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from './header';
import styles from '../../styles/styles';

export default function Home() {
  const navigator = useNavigation();

  return (
    <View style={[styles.flexTop, styles.background]}>
      <Header />

      <TouchableOpacity style={styles.button} onPress={() => {
        // TODO: fix this
        navigator.navigate('Settings' as never);
      }}>
        <Text style={styles.text}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}