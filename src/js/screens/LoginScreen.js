import React from "react";
import { SafeAreaView, StyleSheet, View, Text, StatusBar, Button, Image } from "react-native";
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import AccountManager from "../managers/AccountManager"

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
            await GoogleSignin.hasPlayServices();

            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo);
            AccountManager.setUserName(userInfo.user.name);
            AccountManager.setUserEmail(userInfo.user.email);
            AccountManager.setUserPhoto(userInfo.user.photo);
            AccountManager.saveUserInfo();

            const idToken = await (await GoogleSignin.getTokens()).idToken;
            let response = await fetch("https://api.winty.io/login/google", { headers: { "Authorization": idToken } });
            const tokenSet = await response.json();
            AccountManager.setTokenSet(tokenSet);
            AccountManager.saveTokenSet();

            this.props.navigation.replace("TabNavigationScreen");

            this.setState({
                userInfo: AccountManager.getUserInfo(),
                loaded: true
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <View>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <GoogleSigninButton
                        style={{ width: 192, height: 48 }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={this.signIn.bind(this)} />

                    {this.state.loaded ?
                        <View>
                            <Text>{this.state.userInfo.name}</Text>
                            <Text>{this.state.userInfo.email}</Text>
                            <Image
                                style={{ width: 100, height: 100 }}
                                source={{ uri: this.state.userInfo.photo }}
                            />
                        </View> :

                        <Text>Not SignedIn</Text>
                    }
                </SafeAreaView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    listHeader: {
        backgroundColor: '#eee',
        color: "#222",
        height: 44,
        padding: 12
    },
    detailContainer: {
        paddingHorizontal: 20
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 10
    },
    message: {
        fontSize: 14,
        paddingBottom: 15,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1
    },
    dp: {
        marginTop: 32,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

export default LoginScreen;