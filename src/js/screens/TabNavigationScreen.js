import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import CalendarScreen from "./CalendarScreen";
import HistoryScreen from "./HistoryScreen";
import SettingScreen from "./SettingScreen";

const Tab = createBottomTabNavigator();
function TabNavigationScreen() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="CalendarScreen" component={CalendarScreen} options={{ headerShown: false }} />
            <Tab.Screen name="HistoryScreen" component={HistoryScreen} options={{ headerShown: false }} />
            <Tab.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}

export default TabNavigationScreen;