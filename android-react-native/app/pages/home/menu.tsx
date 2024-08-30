import React, { PropsWithChildren } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../../styles/styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { transform } from '@babel/core';

export default function Menu(props: any) {
    const navigator = useNavigation();

    const close = () => props.closer(false);

    // const openAnimation = useSharedValue(-100);

    // openAnimation.value = withTiming(0, {duration: 100 });

    // const animatedStyle = useAnimatedStyle(() => ({
    //     transform: [{ translateX: openAnimation.value }]
    // }));

    return (
        <>
        <TouchableOpacity style={pageStyles.overlay} onPress={() => close()}></TouchableOpacity>
        <View style={[styles.flexTop, styles.background, styles.container, pageStyles.container, { gap: 4 }]}>

            <TouchableOpacity style={pageStyles.menuItem} onPress={() => {close(); navigator.navigate('Settings' as never)}}>
                <Text style={styles.largeText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={pageStyles.menuItem} onPress={() => {close(); navigator.navigate('TOS' as never)}}>
                <Text style={styles.largeText}>TOS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={pageStyles.menuItem} onPress={() => {close(); navigator.navigate('Privacy' as never)}}>
                <Text style={styles.largeText}>Privacy policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={pageStyles.menuItem} onPress={() => {close(); navigator.navigate('Login' as never)}}>
                <Text style={styles.largeText}>Logout</Text>
            </TouchableOpacity>
        </View>
        </>
    );
}

const pageStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 2,
        top: '100%',
        left: '2%',
        width: '45%',
        height: '350%',
        backgroundColor: '#001F3F',
        shadowColor: '#5A2D81',
        shadowRadius: 100,
        shadowOpacity: 300
    },
    overlay: {
        position: 'absolute',
        zIndex: 1,
        top: '-10%',
        left: 0,
        width: '100%',
        height: '1010%',
        backgroundColor: '#00000060'
    },
    menuItem: {
        color: '#ffffff',
        borderColor: '#00000000',
        borderTopColor: '#303030',
        borderWidth: 1,
        width: '100%',
        marginBottom: '5%'
    }
});
