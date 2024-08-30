import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/home/home';
import Settings from '../pages/settings';
import Login from '../pages/login';

const Theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: 'black'
	}
};


const Stack = createStackNavigator();

export default function MainStack() {
	return (
		<NavigationContainer theme={Theme} independent={true}>
			<Stack.Navigator initialRouteName="Login">
				<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
				<Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
				<Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}