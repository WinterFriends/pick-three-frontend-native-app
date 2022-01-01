import React from "react";
import { SafeAreaView, StyleSheet, View, Text, StatusBar, Button, Image } from "react-native";
import AccountManager from "../managers/AccountManager"

class SplashScreen extends React.Component {
    constructor(props) {
        super(props);
        let navigation = props.navigation;
        AccountManager.loadTokenSet().then(logedin => {
            if (logedin) {
                AccountManager.loadUserInfo()
                    .then(navigation.replace("TabNavigationScreen"));
            }
            else
                navigation.replace("LoginScreen");
        });
    }


    render() {
        return (
            <View>
                <SafeAreaView>
                    <Text>SplashScreen</Text>
                </SafeAreaView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
});

export default SplashScreen;