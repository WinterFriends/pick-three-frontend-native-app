import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import SettingElement from "../components/SettingElement";
import StatusBar from "../components/StatusBar";
import AccountManager from "../managers/AccountManager";
import Colors from "../common/Colors";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Styles from "../common/Styles";

const socialImage = {
    "google": require("../../img/social_google.png")
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
        GoogleSignin.signOut().then(() => {
            AccountManager.logout();
            this.props.navigation.replace("LoginScreen");
        });
    }

    onPressDeleteAccount() {
        console.log("SettingScreen.onPressDeleteAccount");
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
                <ScrollView style={styles.mainScrollView}>
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
                    <SettingElement title="공지사항" />
                    <SettingElement title="서비스 이용약관" />
                    <SettingElement title="개인정보처리방침" />
                    <SettingElement title="문의하기" />

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