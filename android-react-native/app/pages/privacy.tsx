import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles/styles';
import BackHeader from '../components/back_header';

export default function Privacy() {
    const navigator = useNavigation();

    return (
        <View style={[styles.flexTop, styles.background]}>
            <BackHeader>
                <Text style={[styles.largeText, styles.bold, {fontSize: 24, fontWeight: 600}]}>Privacy Policy</Text>
            </BackHeader>
        </View>
    );
}