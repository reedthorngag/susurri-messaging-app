import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

import styles, { textColor } from '../../styles/styles';
import BackHeader from '../../components/back_header';
import { getInitialDmMessages, requestNewMessagesAsync } from '@/app/util/data_controller';
import { localDB } from '@/app/util/local_db';
import { Message } from '@/app/util/cache';

export default function DM(props: any) {
	const navigator = useNavigation();

	console.log(props.route.params.user);

	const chatHash = props.route.params.user.chatHash;

	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState({});

	useEffect(() => {
		(async () => {
			const users: {[hash: string]: string} = {};
			users[localDB!.user.hash] = localDB!.user.name;
			users[props.route.params.user.hash] = props.route.params.user.name;
			setUsers(users);
			setMessages((await getInitialDmMessages(props.route.params.user.chatHash))! as never[]);

			const newMessages: Array<Message> = await requestNewMessagesAsync(chatHash);

			if (newMessages.length) setMessages([...messages, ...newMessages] as never);
		})();
	});

	return (
		<View style={[styles.flexTop, styles.background]}>
			<BackHeader>
				<View style={[styles.flexRow, {marginLeft: '-2%', height: '100%'}]}>
            		<Image style={{height: '95%', width: '15%', resizeMode: 'contain'}} source={require('@/assets/images/user-icon.png')}></Image>
					<Text style={[styles.largeText, styles.bold, {margin: '3%', fontSize: 24, fontWeight: 600}]}>{props.route.params.user.name}</Text>
				</View>
			</BackHeader>
			<View style={{width: '100%', left: '5%', marginTop: '5%', zIndex: -1}}>
				<ScrollView style={{height: '80%', overflow: 'scroll', width: '90%', paddingTop: '120%'}}>
					{/* messages here */}
					{messages.map((message: Message) => {
						return <>
							<View style={[styles.flexRow]}>
								<Text style={[styles.text, {position: 'absolute', left: '4%', top:'40%'}]}>{(users as {[hash:string]:string})[message.user]}</Text>
								<Text style={[styles.largeText,styles.container, {marginLeft: '83%', paddingLeft: '4%', paddingRight: '4%'}]}>{message.data}</Text>
							</View>
							{/* <View style={[styles.flexRow]}><Text style={[styles.largeText, styles.container, {paddingLeft: '4%', paddingRight: '4%'}]}>Hello</Text></View> */}
						</>
					})}
				</ScrollView>
			</View>
			<View style={[styles.foreground, pageStyles.inputContainer]}>
				<View style={pageStyles.attachment}>
					<Text style={pageStyles.attachmentText}>+</Text>
				</View>
				<TextInput style={[styles.input, styles.text, pageStyles.input]} placeholder='Username' placeholderTextColor={'grey'}></TextInput>
				<TouchableOpacity style={{ height: '100%', width: '20%', left: '-2%' }} onPress={() => navigator.navigate((props.to || 'Home') as never)}>
					<Image style={{ height: '40%', width: '100%', top: '30%', marginLeft: '-5%', resizeMode: 'contain'}} source={require('@/assets/images/arrow.png')}></Image>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const pageStyles = StyleSheet.create({
	dmHeader: {

	},
	inputContainer: {
		height: 100,
		paddingBottom: '3%',
		paddingTop: '2%',
		paddingLeft: '5%',
		flexDirection: 'row',
		width: '100%'
	},
	input: {
		height: '60%',
		borderRadius: 30
	},
	attachment: {
		height: 34,
		width: 36,
		margin: 'auto',
		borderWidth: 3,
		borderColor: textColor,
		borderRadius: 30,
		padding: 4,
		marginRight: '2%'
	},
	attachmentText: {
		fontFamily: 'NotoSansBold',
		fontSize: 40,
		color: textColor,
		marginTop: '-90%'
	}
});
