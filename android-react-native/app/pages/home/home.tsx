import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../../styles/styles';
import Header from './header';

export default function Home() {
	const navigator = useNavigation();

	return (
		<View style={[styles.flexTop, styles.background]}>
			<Header />
		</View>
	);
}