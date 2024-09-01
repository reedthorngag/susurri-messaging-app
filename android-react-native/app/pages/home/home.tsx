import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

import styles from '../../styles/styles';
import Header from './header';
import DM from './dm';

export default function Home() {
	const navigator = useNavigation();

	const dms: string[] = ['A User', 'long test name'];

	return (
		<View style={[styles.flexTop, styles.background]}>
			<Header />
			<View style={{width: '100%', left: '5%', marginTop: '5%', zIndex: -1}}>
				<View style={{flexDirection: 'row', marginBottom: '5%', height: '13%'}}>
					<Text style={[styles.largeText, pageStyles.dmHeader]}>DMs</Text>
					<TouchableOpacity style={{position: 'absolute', right: '12%', top: 0, height: '100%', width: '14%'}} onPress={() => navigator.navigate("DM", {user: 'New user'})}>
						<Image style={{height: '120%', width: '100%', resizeMode: 'contain'}} source={require('@/assets/images/new-message-icon.png')}></Image>
					</TouchableOpacity>
				</View>
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
		marginLeft: '2%'
	}
});
