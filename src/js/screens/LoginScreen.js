import React from "react";
import { StyleSheet, View, Text, Image, Linking, TouchableOpacity, Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constant from "../common/Constant";
import AccountManager from "../managers/AccountManager"
import StatusBar from "../components/StatusBar";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Colors from "../common/Colors";
import Styles from "../common/Styles";
import ApiManager from "../managers/ApiManager";

import Key from "../../value/Key.json";

GoogleSignin.configure({
    webClientId: Key.googleLoginClientId,
    offlineAccess: true
});

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
            loaded: false
        }
    }

    initLoginInfo = async (tokenSet) => {
        try {
            let flag = await AccountManager.initLoginInfo(tokenSet);
            if (flag) this.props.navigation.replace("SplashScreen", { targetPage: "ManualScreen" });
        }
        catch (error) {
            console.log(error);
        }
    }

    signInByGoogle = async () => {
        try {
            // 구글 로그인
            await GoogleSignin.hasPlayServices();

            await GoogleSignin.signIn();

            const tokens = await GoogleSignin.getTokens();
            const idToken = tokens.idToken;

            // winty 로그인
            const tokenSet = await ApiManager.loginByGoogle(idToken);
            await this.initLoginInfo(tokenSet);
        }
        catch (error) {
            console.log(error);
        }
    }

    signInByGuest = async () => {
        try {
            // 게스트 토큰 확인
            let guestIdToken = await AsyncStorage.getItem("guestIdToken");
            if (!guestIdToken) {
                Alert.alert(
                    "게스트로 시작하기",
                    "게스트로 시작할 경우 '앱 삭제', '앱 데이터 삭제' 등의 행동을 할 경우 앱 내에서 작성하신 데이터가 없어집니다.\n그래도 진행하시겠습니까?\n(게스트 로그인 후에도 소셜 계정 연동 가능)",
                    [
                        { text: "아니오", style: "cancel" },
                        {
                            text: "예", onPress: () => {
                                ApiManager.getGuestIdToken()  // 아이디 토큰 발급
                                    .then(idToken => {
                                        if (!idToken) return;

                                        AsyncStorage.setItem("guestIdToken", idToken)  // 아이디 토큰 저장
                                            .then(() => {
                                                ApiManager.loginByGuest(idToken)
                                                    .then(tokenSet => this.initLoginInfo(tokenSet));
                                            });
                                    })
                            }
                        }
                    ],
                    { cancelable: true });
            }
            else {
                ApiManager.loginByGuest(guestIdToken)
                    .then(tokenSet => this.initLoginInfo(tokenSet));
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}></View>

                <Image source={require("../../img/pickple_logo.png")} style={styles.logo} />

                <Text style={styles.title}>Pickple</Text>
                <Text style={styles.welcome}>소셜 계정으로 빠르게 시작해보세요</Text>

                <TouchableOpacity style={{ /* marginBottom: 17 */ }} activeOpacity={Styles.activeOpacity} onPress={this.signInByGoogle.bind(this)}>
                    <View style={styles.loginButton}>
                        <Image style={{ ...styles.loginButtonImage, width: 16, height: 16 }} source={require("../../img/login_google.png")} />
                        <Text style={styles.loginButtonText}>Google 계정으로 시작하기</Text>
                    </View>
                </TouchableOpacity>

                {/* <TouchableOpacity activeOpacity={Styles.activeOpacity} onPress={this.signInByGoogle.bind(this)}>
                    <View style={styles.loginButton}>
                        <Image style={{ ...styles.loginButtonImage, width: 15, height: 18 }} source={require("../../img/login_apple.png")} />
                        <Text style={styles.loginButtonText}>Apple 계정으로 시작하기</Text>
                    </View>
                </TouchableOpacity> */}

                <TouchableOpacity style={styles.guestLoginTouchableOpacity} activeOpacity={Styles.activeOpacity} onPress={this.signInByGuest.bind(this)}>
                    <View style={styles.guestLoginContainer}>
                        <Text style={styles.guestLoginText}>게스트로 시작하기</Text>
                    </View>
                </TouchableOpacity>

                <Text style={styles.notice}>
                    회원 가입 시,{" "}
                    <Text style={styles.underLine} onPress={() => { Linking.openURL(Constant.PICKPLE_DOMAIN + "/policies/service.html") }}>서비스 이용약관</Text>
                    {" "}및{" "}
                    <Text style={styles.underLine} onPress={() => { Linking.openURL(Constant.PICKPLE_DOMAIN + "/policies/privacy.html") }}>개인정보처리방침</Text>
                    에 동의한 것으로 간주합니다.
                </Text>
                <StatusBar style="light" />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        height: "100%",
        paddingTop: getStatusBarHeight(),
        paddingHorizontal: 35,
        backgroundColor: "#222222"
    },
    logo: {
        width: 53,
        height: 53,
        marginBottom: 19
    },
    title: {
        ...Styles.textStyle.head01,
        fontSize: 35,
        color: Colors.primary01,
        marginBottom: 14
    },
    welcome: {
        ...Styles.textStyle.body01,
        color: Colors.white,
        marginBottom: 60
    },
    notice: {
        ...Styles.textStyle.body03,
        color: Colors.gray03,//black03,
        marginBottom: 90
    },
    underLine: {
        textDecorationLine: "underline"
    },

    // 로그인 버튼
    loginButton: {
        flexDirection: "row",
        width: "100%",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: Colors.white
    },
    loginButtonImage: {
        position: "absolute",
        left: 27
    },
    loginButtonText: {
        flex: 1,
        ...Styles.textStyle.subtitle01,
        textAlign: "center"
    },

    // 게스트
    guestLoginTouchableOpacity: {
        /* margin -5는 paddingVertical */
        marginTop: 22 - 5,
        marginBottom: 42 - 5,
    },
    guestLoginContainer: {
        alignSelf: "center",
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    guestLoginText: {
        ...Styles.textStyle.body02,
        textAlign: "center",
        color: Colors.black05,
        textDecorationLine: "underline"
    }
});

export default LoginScreen;