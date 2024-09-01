import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { View } from "react-native";

import styles from "./styles/styles";

const Theme = { 
  ...DefaultTheme, 
  colors: {
    ...DefaultTheme.colors, 
    background: '#05122d',
  }
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    NotoSans: require('../assets/fonts/NotoSans-Regular.ttf'),
    NotoSansBold: require('../assets/fonts/NotoSans-Medium.ttf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <>
      <View style={[{height: 30}, styles.background]}></View>
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
      </Stack>
      </>
  );
}
