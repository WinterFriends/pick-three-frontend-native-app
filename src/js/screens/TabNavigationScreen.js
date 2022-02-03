import React from "react";
import { Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import CalendarScreen from "./CalendarScreen";
import ReportScreen from "./ReportScreen";
import SettingScreen from "./SettingScreen";
import Colors from "../common/Colors";

const Tab = createBottomTabNavigator();
class TabNavigationScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {
                        height: 24 + (26 * 2),  // iconSize + paddingVertivcal
                    }
                }} >

                <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ ...tabScreenOption, tabBarIcon: ({ color }) => <Image style={{ ...styles.tabScreenIcon, tintColor: color }} source={require("../../img/tab_home.png")} /> }} />
                <Tab.Screen name="CalendarScreen" component={CalendarScreen} options={{ ...tabScreenOption, tabBarIcon: ({ color }) => <Image style={{ ...styles.tabScreenIcon, tintColor: color }} source={require("../../img/tab_calendar.png")} /> }} />
                <Tab.Screen name="ReportScreen" component={ReportScreen} options={{ ...tabScreenOption, tabBarIcon: ({ color }) => <Image style={{ ...styles.tabScreenIcon, tintColor: color }} source={require("../../img/tab_report.png")} /> }} />
                <Tab.Screen name="SettingScreen" component={SettingScreen} options={{ ...tabScreenOption, tabBarIcon: ({ color }) => <Image style={{ ...styles.tabScreenIcon, tintColor: color }} source={require("../../img/tab_setting.png")} /> }} />

            </Tab.Navigator>
        );
    }
}

const tabScreenOption = {
    headerShown: false,
    tabBarShowLabel: false,
    tabBarActiveTintColor: Colors.primary01,
    tabBarInactiveTintColor: Colors.gray02
};

const styles = StyleSheet.create({
    tabScreenIcon: {
        width: 24,
        height: 24
    }
});

export default TabNavigationScreen;