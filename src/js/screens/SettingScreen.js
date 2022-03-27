import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert, Platform } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import appleAuth, { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
var uuid = require('rn-uuid');
import AsyncStorage from "@react-native-async-storage/async-storage";
import SettingElement from "../components/SettingElement";
import StatusBar from "../components/StatusBar";
import AccountManager from "../managers/AccountManager";
import Colors from "../common/Colors";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Styles from "../common/Styles";
import Constant from "../common/Constant";
import ApiManager from "../managers/ApiManager";

import Key from "../../value/Key.json";

GoogleSignin.configure({
    webClientId: Key.googleLoginClientId,
    offlineAccess: true
});

const socialImage = {
    "google": require("../../img/social_google.png"),
    "apple": require("../../img/social_apple.png")
}

class SettingScreen extends React.Component {
    constructor(props) {
        super(props);

        let userProfile = AccountManager.getUserProfile();

        this.state = {
            name: userProfile.getName(),
            email: userProfile.getEmail(),
            social: userProfile.getSocial()
        }
    }

    onPressUpdateProfile() {
        console.log("SettingScreen.onPressUpdateProfile");
        let unsubscribe = this.props.navigation.addListener('focus', () => {
            console.log("SettingScreen.onFocus: onPressUpdateProfile");

            let userProfile = AccountManager.getUserProfile();
            this.setState({
                name: userProfile.getName(),
                email: userProfile.getEmail(),
                social: userProfile.getSocial()
            }, unsubscribe());
        });
        this.props.navigation.navigate("EditProfileScreen", { goBackAble: true });
    }

    onPressLogOut() {
        console.log("SettingScreen.onPressLogOut");
        switch (AccountManager.getUserProfile().getSocial()) {
            case "google":
                GoogleSignin.signOut().then(() => {
                    AccountManager.logout();
                    this.props.navigation.replace("LoginScreen");
                    return;
                });
                break;

            case "apple":
                AccountManager.logout();
                this.props.navigation.replace("LoginScreen");
                break;

            case "guest":
                AccountManager.logout();
                this.props.navigation.replace("LoginScreen");
                break;
        }
    }

    onPressDeleteAccount() {
        let alert = (msg, callback) => Alert.alert(
            "계정 삭제",
            msg,
            [
                {
                    text: "아니오",
                    style: "cancel"
                },
                {
                    text: "예",
                    onPress: () => { callback() }
                }
            ],
            {
                cancelable: true
            });

        alert("계정을 삭제하시겠습니까?\n계정 삭제 시, 모든 데이터를 복구할 수 없습니다.", () => {
            alert("정말 진짜로 삭제하시겠습니까?", () => {
                ApiManager.deleteAccount()
                    .then(() => {
                        switch (AccountManager.getUserProfile().getSocial()) {
                            case "google":
                                GoogleSignin.signOut()
                                    .then(() => {
                                        AccountManager.logout();
                                        this.props.navigation.replace("LoginScreen");
                                    });
                                break;

                            case "apple":
                                AccountManager.logout();
                                this.props.navigation.replace("LoginScreen");
                                break;

                            case "guest":
                                AsyncStorage.removeItem("guestIdToken")
                                    .then(() => {
                                        AccountManager.logout();
                                        this.props.navigation.replace("LoginScreen");
                                    })
                                break;
                        }
                    });
            })
        })
    }

    async onPressLinkGoogleAccount() {
        let status = 0;
        let success = false;
        let msg = "연동에 실패했습니다.";

        try {
            // 구글 로그아웃
            await GoogleSignin.signOut();

            // 구글 로그인
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn();

            const tokens = await GoogleSignin.getTokens();
            const googleIdToken = tokens.idToken;

            // 게스트 아이디 토큰 확인
            let guestIdToken = await AsyncStorage.getItem("guestIdToken");

            if (!guestIdToken) {
                msg = "guestIdToken이 없습니다.";
                throw new Error("guestIdToken이 없습니다.");
            }

            // 링크 api 호출
            let linkResult = await ApiManager.linkGoogleAccount(guestIdToken, googleIdToken);
            status = linkResult.status;
            success = linkResult.success;
            msg = linkResult.msg;
        }
        catch (error) {
            console.log(error);
        }
        finally {
            Alert.alert(
                `연동 ${success ? "성공" : "실패"}`,
                `${msg}${success ? "" : `\n(status: ${status})`}`,
                [{
                    text: "확인",
                    onPress: () => {
                        if (!success) return;

                        // 연동 성공 후, 게스트 아이디 토큰 삭제 및 화면 전환
                        AsyncStorage.removeItem("guestIdToken").then(() => {
                            GoogleSignin.signOut().then(() => {
                                AccountManager.logout();
                                this.props.navigation.replace("LoginScreen");
                            });
                        });
                    }
                }],
                { cancelable: false }
            );
        }
    }

    async onPressLinkAppleAccount() {
        let status = 0;
        let success = false;
        let msg = "연동에 실패했습니다.";

        try {
            // 게스트 아이디 토큰 확인
            let guestIdToken = await AsyncStorage.getItem("guestIdToken");

            let AppleIdToken = null;

            // Android
            if (Platform.OS == "android") {
                AppleIdToken = await this.signInByAppleAndroid();
            }
            // iOS
            else {
                // performs login request
                const appleAuthRequestResponse = await appleAuth.performRequest({
                    requestedOperation: appleAuth.Operation.LOGIN,
                    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
                });

                // get current authentication state for user
                // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
                // const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

                AppleIdToken = appleAuthRequestResponse.identityToken;
            }

            // 애플 아이디 토큰 확인
            if (!AppleIdToken) return;

            // 링크 api 호출
            // /!\ 구현 필요
            let linkResult = await ApiManager.linkAppleAccount(guestIdToken, AppleIdToken);
            status = linkResult.status;
            success = linkResult.success;
            msg = linkResult.msg;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            Alert.alert(
                `연동 ${success ? "성공" : "실패"}`,
                `${msg}${success ? "" : `\n(status: ${status})`}`,
                [{
                    text: "확인",
                    onPress: () => {
                        if (!success) return;

                        // 연동 성공 후, 게스트 아이디 토큰 삭제 및 화면 전환
                        AsyncStorage.removeItem("guestIdToken").then(() => {
                            AccountManager.logout();
                            this.props.navigation.replace("LoginScreen");
                        });
                    }
                }],
                { cancelable: false }
            );
        }
    }

    async signInByAppleAndroid() {
        // Generate secure, random values for state and nonce
        const rawNonce = uuid.v4();
        const state = uuid.v4();

        // Configure the request
        appleAuthAndroid.configure({
            // The Service ID you registered with Apple
            clientId: 'io.winty.pickple.web',

            // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
            // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
            redirectUri: 'https://api.pickple.winty.io/apple/web/callback',

            // The type of response requested - code, id_token, or both.
            responseType: appleAuthAndroid.ResponseType.ALL,

            // The amount of user information requested from Apple.
            scope: appleAuthAndroid.Scope.ALL,

            // Random nonce value that will be SHA256 hashed before sending to Apple.
            nonce: rawNonce,

            // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
            state,
        });

        // Open the browser window for user sign in
        const response = await appleAuthAndroid.signIn();

        idToken = response.id_token

        return idToken;
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 상단바 */}
                <View style={styles.topbar}>
                    <View style={styles.buttons}>
                    </View>

                    {/* 타이틀 */}
                    <Text style={styles.title}>Setting</Text>
                </View>

                {/* 스크롤 뷰 */}
                <ScrollView style={styles.mainScrollView} contentContainerStyle={{ paddingBottom: 50 }}>
                    {/* 프로필 */}
                    <View style={styles.profileContainer}>
                        <SettingElement
                            title={
                                <Text style={Styles.textStyle.body05}>
                                    <Text style={{ ...Styles.textStyle.subtitle01, fontSize: 24 }}>
                                        {this.state.name}
                                    </Text>님
                                </Text>
                            }
                            onPress={this.onPressUpdateProfile.bind(this)} />

                        {/* 소셜 정보 */}
                        <View style={styles.socialContainer}>
                            <Image style={styles.socialIcon} source={socialImage[this.state.social]} />
                            <Text style={styles.socialEmail}>{this.state.email}</Text>
                        </View>
                    </View>

                    {/* 버튼 */}
                    <SettingElement onPress={() => { Linking.openURL(Constant.PICKPLE_DOMAIN + "/notice.html") }} title="공지사항" />
                    <SettingElement onPress={() => { Linking.openURL(Constant.PICKPLE_DOMAIN + "/policies/service.html") }} title="서비스 이용약관" />
                    <SettingElement onPress={() => { Linking.openURL(Constant.PICKPLE_DOMAIN + "/policies/privacy.html") }} title="개인정보처리방침" />
                    <SettingElement onPress={() => { Linking.openURL(Constant.PICKPLE_DOMAIN + "/support.html") }} title="문의하기" />

                    {
                        AccountManager.getUserProfile().getSocial() == "guest" &&
                        <View style={{ flexDirection: "column" }}>
                            <View style={styles.secantLineContainer}>
                                <View style={styles.secantLine}></View>
                            </View>

                            <SettingElement title="Google 계정과 연동하기" onPress={this.onPressLinkGoogleAccount.bind(this)} />
                            <SettingElement title="Apple 계정과 연동하기" onPress={this.onPressLinkAppleAccount.bind(this)} />
                        </View>
                    }

                    <View style={styles.secantLineContainer}>
                        <View style={styles.secantLine}></View>
                    </View>

                    <SettingElement title="로그아웃" onPress={this.onPressLogOut.bind(this)} />
                    <SettingElement title="계정삭제" onPress={this.onPressDeleteAccount.bind(this)} />
                </ScrollView>


                <StatusBar />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        paddingTop: getStatusBarHeight(),
        backgroundColor: Colors.white
    },

    // 상단바
    topbar: {
        justifyContent: "center"
    },
    buttons: {
        marginVertical: 15,
        width: 24,
        height: 24
    },
    title: {
        ...Styles.textStyle.head02,
        position: "absolute",
        marginLeft: 25
    },

    // 메인 스크롤
    mainScrollView: {
        width: "100%"
    },

    // 프로필
    profileContainer: {
        paddingVertical: 52,
    },
    socialContainer: {
        flexDirection: "row",
        paddingHorizontal: 27,
        alignItems: "center"
    },
    socialIcon: {
        width: 13,
        height: 13,
        marginRight: 6
    },
    socialEmail: {
        ...Styles.textStyle.body03
    },

    // 구분선
    secantLineContainer: {
        width: "100%",
        paddingHorizontal: 27,
    },
    secantLine: {
        width: "100%",
        height: 1,
        marginVertical: 26,
        backgroundColor: Colors.gray01
    }
});

export default SettingScreen;