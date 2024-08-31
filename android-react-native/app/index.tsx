import { Text, View } from "react-native";
import MainStack from "./nav/main_stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Index() {
  return (
    <GestureHandlerRootView>
      <MainStack />
    </GestureHandlerRootView>
  );
}
