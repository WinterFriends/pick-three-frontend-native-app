import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
            logedin: false,
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

            if (!this.state.init) return;

            // 화면 이동
            this.navigation.replace(this.state.targetPage);

        }, 1000);
    }

    setLoginState(state) {
        let targetPage = state ? this.state.targetPage : "LoginScreen";

        if (state) {
            this.initData().then(() => {
                this.setState({ init: true, logedin: true, targetPage });
                if (this.state.timeout) this.navigation.replace(targetPage);
            });
        }
        else {
            this.setState({ init: true, logedin: false, targetPage });
            if (this.state.timeout) this.navigation.replace(targetPage);
        }

    }

    init() {
        // 토큰 가져오기
        AccountManager.loadTokenSet()
            .then(logedin => {
                // 로그인 안됨
                if (!logedin) {
                    this.setLoginState(false);
                    return;
                }

                // 로그인 됨
                // 토큰 상태 확인
                let tokenState = JwtUtils.getTokenState(AccountManager.getAccessToken(), AccountManager.getRefreshToken());

                // 이상 없음 (엑세스 토큰 기간 안지남)
                if (tokenState == TokenState.None) {
                    this.setLoginState(true);
                }
                // 엑세스 토큰 만료
                else if (tokenState == TokenState.NeedRefresh) {
                    // 리스레쉬 토큰을 통해 엑세스 토큰 재발급
                    ApiManager.refreshToken(AccountManager.getRefreshToken())
                        .then(tokenSet => {
                            AccountManager.initLoginInfo(tokenSet);
                            this.setLoginState(true);
                        })
                        .catch(err => this.toastInternetError(err));
                }
                // 리프레쉬 토큰 만료
                else if (tokenState == TokenState.NeedRelogin) {
                    // 각 소셜 타입에 따라 처리
                    AccountManager.loadUserProfile().then(userProfile => {
                        switch (userProfile.getSocial()) {
                            /* 구글 */
                            case "google":
                                GoogleSignin.signOut().then(() => {
                                    AccountManager.logout();
                                    this.setLoginState(false);
                                    return;
                                });
                                break;

                            /* 애플 */
                            case "apple":
                                break;

                            /* 게스트 */
                            case "guest":
                                AsyncStorage.getItem("guestIdToken").then(idToken => {
                                    if (!idToken) {
                                        AccountManager.logout();
                                        this.setLoginState(false);
                                        return;
                                    }

                                    // 재로그인
                                    ApiManager.loginByGuest(idToken).then(tokenSet => {
                                        AccountManager.initLoginInfo(tokenSet).then(flag => {
                                            if (!flag) AccountManager.logout();
                                            this.setLoginState(flag);
                                            return;
                                        });
                                    });
                                });
                                break;
                        }
                    });
                }
            })

    }

    async initData() {
        try {
            await AccountManager.loadUserProfile();

            let goalList = await ApiManager.getGoalList();
            GoalManager.setGoalList(goalList);

            return true;
        }
        catch (error) {
            return false;
        }
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