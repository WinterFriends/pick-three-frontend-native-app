import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./src/js/screens/SplashScreen";
import LoginScreen from "./src/js/screens/LoginScreen";
import TabNavigationScreen from "./src/js/screens/TabNavigationScreen";
import SelectGoalScreen from "./src/js/screens/SelectGoalScreen";
import WriteDiaryScreen from "./src/js/screens/WriteDiaryScreen";
import EditProfileScreen from "./src/js/screens/EditProfileScreen";
import ManualScreen from './src/js/screens/ManualScreen';
import { LogBox } from "react-native";


/*
LogBox.ignoreLogs([
  "Non-serializable",               // 다이어리 화면
  "Animated: `useNativeDriver`",    // 더블 클릭
  "Can't perform a React",          // 더블 클릭
  "Possible Unhandled",             // 인터넷 연결 실패
]);
*/

LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ManualScreen" component={ManualScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TabNavigationScreen" component={TabNavigationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SelectGoalScreen" component={SelectGoalScreen} options={{ headerShown: false }} />
          <Stack.Screen name="WriteDiaryScreen" component={WriteDiaryScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;