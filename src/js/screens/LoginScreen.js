import React from "react";
import { SafeAreaView, StyleSheet, View, Text, Button, Image } from "react-native";
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import Constant from "../common/Constant";
import AccountManager from "../managers/AccountManager"
import StatusBar from "../components/StatusBar";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Colors from "../common/Colors";
import Styles from "../common/Styles";

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

            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo);
            AccountManager.setUserName(userInfo.user.name);
            AccountManager.setUserEmail(userInfo.user.email);
            AccountManager.setUserPhoto(userInfo.user.photo);
            AccountManager.saveUserInfo();

            const tokens = await GoogleSignin.getTokens();
            const idToken = tokens.idToken;

            // winty 로그인
            let wintyLoginUri = Constant.API_DOMAIN + "/login/google";
            let response = await fetch(wintyLoginUri, { headers: { "Authorization": idToken } });
            const tokenSet = await response.json();
            AccountManager.setTokenSet(tokenSet);
            AccountManager.saveTokenSet();

            let accessToken = AccountManager.getAccessToken();
            if (accessToken == null) {
                return console.log("LoginScreen.signIn: Login failed");
            }

            this.props.navigation.replace("SplashScreen");
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


                <GoogleSigninButton
                    style={{ width: "100%", height: 50, marginBottom: 30 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Light}
                    onPress={this.signIn.bind(this)} />

                <Text style={styles.notice}>회원 가입 시, 이용약관 및 개인정보처리방침에 동의한 것으로 간주합니다.</Text>
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
        color: Colors.black03,
        marginBottom: 90
    }
});

export default LoginScreen;