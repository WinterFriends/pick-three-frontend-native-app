import React from "react";
import { SafeAreaView, StyleSheet, View, Text, StatusBar, Button, Image } from "react-native";
import AccountManager from "../managers/AccountManager"
import ApiManager from "../managers/ApiManager";
import GoalManager from "../managers/GoalManager";

class SplashScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            init: false,
            logedin: null,
            timeout: false
        };
        this.navigation = props.navigation;
    }

    componentDidMount() {
        this.timer();
        this.init();
    }

    timer() {
        setTimeout(() => {
            this.setState({ timeout: true });

            // 화면 이동
            if (this.state.init === true && this.state.logedin === true) {
                this.navigation.replace("TabNavigationScreen");
            }
            else if (this.state.init === true && this.state.logedin === false) {
                this.navigation.replace("LoginScreen");
            }
        }, 1000);
    }

    init() {
        AccountManager.loadTokenSet()
            .then(logedin => {
            if (logedin) {
                AccountManager.loadUserInfo()
                        .then(
                            ApiManager.getGoalList()
                                .then(goalList => {
                                    // 목표 배열 초기화
                                    GoalManager.setGoalList(goalList);
                                    console.log("SplashScreen.constructor: GoalManager.setGoalList");

                                    this.setState({ init: true, logedin: true });

                                    // 화면 이동
                                    if (this.state.timeout)
                                        this.navigation.replace("TabNavigationScreen");
                                })
                        );

                }
                else {
                    this.setState({ init: true, logedin: false });

                    // 화면 이동
                    if (this.state.timeout)
                        this.navigation.replace("LoginScreen");
            }
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