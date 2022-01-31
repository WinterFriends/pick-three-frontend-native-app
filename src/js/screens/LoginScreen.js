import React from "react";
import { StyleSheet, View, Text, Image, Linking, TouchableOpacity } from "react-native";
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import Constant from "../common/Constant";
import AccountManager from "../managers/AccountManager"
import StatusBar from "../components/StatusBar";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Colors from "../common/Colors";
import Styles from "../common/Styles";
import ApiManager from "../managers/ApiManager";

GoogleSignin.configure({
    webClientId: "727563278880-89dkcgmm187dok7osr5c1cmjd85dhol3.apps.googleusercontent.com",
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

    signIn = async () => {
        try {
            // 구글 로그인
            await GoogleSignin.hasPlayServices();

            await GoogleSignin.signIn();

            const tokens = await GoogleSignin.getTokens();
            const idToken = tokens.idToken;

            // winty 로그인
            const tokenSet = await ApiManager.loginByGoogle(idToken);
            AccountManager.setTokenSet(tokenSet);
            AccountManager.saveTokenSet();

            // 정상 로그인 확인
            let accessToken = AccountManager.getAccessToken();
            if (accessToken == null) {
                return console.log("LoginScreen.signIn: Login failed");
            }

            // 프로필 저장 및 화면 전환
            ApiManager.getUserProfile()
                .then(userProfile => {
                    console.log(userProfile.toJson());
                    AccountManager.setUserProfile(userProfile);
                    AccountManager.saveUserProfile()
                        .then(this.props.navigation.replace("SplashScreen"));
                });
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

                <TouchableOpacity style={{ marginBottom: 32 /*17*/ }} activeOpacity={Styles.activeOpacity} onPress={this.signIn.bind(this)}>
                    <View style={styles.loginButton}>
                        <Image style={{ ...styles.loginButtonImage, width: 16, height: 16 }} source={require("../../img/login_google.png")} />
                        <Text style={styles.loginButtonText}>Google 계정으로 시작하기</Text>
                    </View>
                </TouchableOpacity>

                {
                    false &&
                    <TouchableOpacity style={{ marginBottom: 32 }} activeOpacity={Styles.activeOpacity} onPress={this.signIn.bind(this)}>
                        <View style={styles.loginButton}>
                            <Image style={{ ...styles.loginButtonImage, width: 15, height: 18 }} source={require("../../img/login_apple.png")} />
                            <Text style={styles.loginButtonText}>Apple 계정으로 시작하기</Text>
                        </View>
                    </TouchableOpacity>
                }

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
        marginBottom: 50
    },
    notice: {
        ...Styles.textStyle.body01,
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
    }
});

export default LoginScreen;