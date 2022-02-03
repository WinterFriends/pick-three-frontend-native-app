import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React from "react";
import { StyleSheet, View, Text, Button, Image, ToastAndroid } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Colors from "../common/Colors";
import Styles from "../common/Styles";
import StatusBar from "../components/StatusBar";
import AccountManager from "../managers/AccountManager"
import ApiManager from "../managers/ApiManager";
import GoalManager from "../managers/GoalManager";
import JwtUtils, { TokenState } from "../utils/JwtUtils";

class SplashScreen extends React.Component {
    constructor(props) {
        super(props);

        let targetPage = "TabNavigationScreen";
        if (this.props.route.params && this.props.route.params.targetPage)
            targetPage = this.props.route.params.targetPage;

        this.state = {
            init: false,
            logedin: null,
            timeout: false,
            targetPage
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
                this.navigation.replace(this.state.targetPage);
            }
            else if (this.state.init === true && this.state.logedin === false) {
                this.navigation.replace("LoginScreen");
            }
        }, 1000);
    }

    init() {
        // 토큰 가져오기
        AccountManager.loadTokenSet()
            .then(logedin => {
                // 로그인 안됨
                if (!logedin) {
                    this.setState({ init: true, logedin: false });

                    // 화면 이동
                    if (this.state.timeout)
                        this.navigation.replace("LoginScreen");

                    return;
                }

                let tokenState = JwtUtils.getTokenState(AccountManager.getAccessToken(), AccountManager.getRefreshToken());

                if (tokenState == TokenState.None) {
                    console.log("SplashScreen.init: tokenState.None");
                    this.initData();
                }
                else if (tokenState == TokenState.NeedRefresh) {
                    console.log("SplashScreen.init: tokenState.NeedRefresh");
                    ApiManager.refreshToken(AccountManager.getRefreshToken())
                        .then(tokenSet => {
                            AccountManager.setTokenSet(tokenSet);
                            AccountManager.saveTokenSet();
                            this.initData();
                        })
                        .catch(err => this.toastInternetError(err));
                }
                else if (tokenState == TokenState.NeedRelogin) {
                    console.log("SplashScreen.init: tokenState.NeedRelogin");
                    GoogleSignin.signOut().then(() => {
                        AccountManager.logout();
                        this.props.navigation.replace("LoginScreen");
                    });
                }
            })

    }

    initData() {
        // 프로필 가져오기
        AccountManager.loadUserProfile()
            .then(() => {
                // 목표 리스트 가져오기
                ApiManager.getGoalList()
                    .then(goalList => {
                        // 목표 배열 초기화
                        GoalManager.setGoalList(goalList);
                        console.log("SplashScreen.initData: GoalManager.setGoalList");

                        this.setState({ init: true, logedin: true });

                        // 화면 이동
                        if (this.state.timeout)
                            this.navigation.replace(this.state.targetPage);
                    })
                    .catch(err => this.toastInternetError(err))
            });
    }

    toastInternetError(err) {
        if (err instanceof Error)
            if (err.message == "Network request failed")
                ToastAndroid.show("앱의 정상적인 사용을 위해서\n인터넷 연결이 필요합니다.", ToastAndroid.LONG);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Image style={styles.logo} source={require("../../img/pickple_logo.png")} />
                    <Text style={styles.title}>Pickple</Text>
                </View>
                <StatusBar />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        height: "100%",
        paddingTop: getStatusBarHeight(),
        justifyContent: "center",
        backgroundColor: Colors.white
    },
    titleContainer: {
        alignItems: "center"
    },
    logo: {
        width: 70,
        height: 70,
        marginBottom: 17
    },
    title: {
        ...Styles.textStyle.head01
    }
});

export default SplashScreen;