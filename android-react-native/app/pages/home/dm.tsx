import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../../styles/styles';

export default function DM(props: any) {
	const navigator = useNavigation();

	return (
		<TouchableOpacity style={[styles.container, styles.flexRow, {marginBottom: '3%'}]} onPress={() => navigator.navigate('DM', { user: props.user })}>
            <Image style={{height: '95%', width: '15%', resizeMode: 'contain'}} source={require('@/assets/images/user-icon.png')}></Image>
			<Text style={[styles.text, styles.bold, {margin: '3%', fontSize: 17}]}>{props.name}</Text>
            <Image style={{position: 'absolute', right: '-105%', top: '45%', marginLeft: '-50%', height: '60%', resizeMode: 'contain'}} source={require('@/assets/images/arrow.png')}></Image>
		</TouchableOpacity>
	);
}