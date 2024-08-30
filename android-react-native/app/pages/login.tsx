import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles/styles';

export default function Login() {
    const navigator = useNavigation();

    return (
        <View style={[styles.flex, styles.background]}>

            <Text style={styles.headerText}>Login</Text>

            <View style={{height: '2%'}}></View>

            <TextInput style={[styles.input, styles.text]} placeholder='Username' placeholderTextColor={'grey'}></TextInput>
            <TextInput style={[styles.input, styles.text]} placeholder='Password' placeholderTextColor={'grey'} secureTextEntry></TextInput>

            <View style={{height: '3%'}}></View>

            <TouchableOpacity style={styles.button} onPress={() => {navigator.navigate('Home' as never);}}>
                <Text style={styles.text}>Login</Text>
            </TouchableOpacity>
            <View style={{height: '20%'}}></View>
        </View>
    );
}