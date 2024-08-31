import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../pages/home/home';
import Settings from '../pages/settings';
import Login from '../pages/login';
import TOS from '../pages/tos';
import Privacy from '../pages/privacy';
import DM from '../pages/dm/dm';

const Theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: 'black'
	}
};


const Stack = createNativeStackNavigator();

export default function MainStack() {
	return (
		<NavigationContainer theme={Theme} independent={true}>
			<Stack.Navigator initialRouteName="Login">
				<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
				<Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
				<Stack.Screen name="DM" component={DM} options={{ headerShown: false }} />
				<Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
				<Stack.Screen name="TOS" component={TOS} options={{ headerShown: false }} />
				<Stack.Screen name="Privacy" component={Privacy} options={{ headerShown: false }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}