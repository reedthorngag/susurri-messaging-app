import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

import styles from '../../styles/styles';
import BackHeader from '../../components/back_header';

export default function DM(props: any) {
	const navigator = useNavigation();

	const dms: string[] = ['hello', 'long test name'];

	return (
		<View style={[styles.flexTop, styles.background]}>
			<BackHeader to={'Home'}>
				<TouchableOpacity style={[styles.flexRow, {marginLeft: '-2%', height: '100%'}]} onPress={() => navigator.navigate('DM' as never, { user: props.name } as never)}>
            		<Image style={{height: '95%', width: '15%', resizeMode: 'contain'}} source={require('@/assets/images/user-icon.png')}></Image>
					<Text style={[styles.largeText, styles.bold, {margin: '3%', fontSize: 24, fontWeight: 600}]}>{props.route.params.user}</Text>
				</TouchableOpacity>
			</BackHeader>
			<View style={{width: '100%', left: '5%', marginTop: '5%', zIndex: -1}}>
				<ScrollView style={{maxHeight: '80%', overflow: 'scroll', width: '90%'}}>
				</ScrollView>
			</View>
		</View>
	);
}

const pageStyles = StyleSheet.create({
	dmHeader: {

	}
});
