import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/home';

const Stack = createStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}