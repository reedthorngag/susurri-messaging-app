import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../../styles/styles';

export default function Header() {
  const navigator = useNavigation();

  return (
    <View style={[styles.foreground, pageStyles.header]}>

    </View>
  );
}

const pageStyles = StyleSheet.create({
    header: {
        height: '10%',
        width: '100%'
    }
});
