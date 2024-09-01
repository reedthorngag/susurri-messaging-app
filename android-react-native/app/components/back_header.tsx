import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles/styles';

export default function BackHeader(props: any) {
    const navigator = useNavigation();


    return (
        <View style={[styles.foreground, pageStyles.header]}>
            <TouchableOpacity style={{ height: '100%', width: '20%', left: '-2%' }} onPress={() => navigator.navigate((props.to || 'Home') as never)}>
                <Image style={{ height: '40%', width: '100%', top: '30%', marginLeft: '-5%', resizeMode: 'contain', transform: [{ rotate: '180deg' }] }} source={require('@/assets/images/arrow.png')}></Image>
            </TouchableOpacity>
            {props.children}
        </View>
    );
}

const pageStyles = StyleSheet.create({
    header: {
        height: 65,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
});
