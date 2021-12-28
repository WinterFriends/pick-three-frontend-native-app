import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigationScreen from "./src/js/screens/TabNavigationScreen";
import SelectGoalScreen from "./src/js/screens/SelectGoalScreen";
import WriteDiaryScreen from "./src/js/screens/WriteDiaryScreen";
import EditProfileScreen from "./src/js/screens/EditProfileScreen";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TabNavigationScreen" component={TabNavigationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SelectGoalScreen" component={SelectGoalScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WriteDiaryScreen" component={WriteDiaryScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}