import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

import styles from '../../styles/styles';
import Header from './header';
import DM from './dm';

export default function Home() {
	const navigator = useNavigation();

	const dms: string[] = ['hello', 'long test name'];

	return (
		<View style={[styles.flexTop, styles.background]}>
			<Header />
			<View style={{width: '100%', left: '5%', marginTop: '5%', zIndex: -1}}>
				<Text style={[styles.largeText, pageStyles.dmHeader]}>DMs</Text>
				<ScrollView style={{maxHeight: '80%', overflow: 'scroll', width: '90%'}}>
					{dms.map(dm => <DM name={dm} key={dm} />)}
				</ScrollView>
			</View>
		</View>
	);
}

const pageStyles = StyleSheet.create({
	dmHeader: {
		fontSize: 24,
		fontFamily: 'NotoSansBold',
		marginLeft: '2%',
		marginBottom: '2%'
	}
});
