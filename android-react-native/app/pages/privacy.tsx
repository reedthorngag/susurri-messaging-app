import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles/styles';

export default function Privacy() {
    const navigator = useNavigation();

    return (
        <View style={[styles.flexTop, styles.background]}>
            <View>
                <TouchableOpacity style={styles.button} onPress={() => {
                    navigator.navigate('Settings' as never);
                }}>
                    <Text style={styles.headerText}>&lt;-</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.text}>Settings</Text>
        </View>
    );
}