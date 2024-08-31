import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles/styles';
import BackHeader from '../components/back_header';

export default function Settings() {
	const navigator = useNavigation();

	return (
		<View style={[styles.flex, styles.background]}>
			<BackHeader>
				<Text style={[styles.largeText, styles.bold, { fontSize: 24, fontWeight: 600 }]}>Settings</Text>
			</BackHeader>
		</View>
	);
}