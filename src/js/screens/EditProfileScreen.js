import React from "react";
import { View, Text, Button, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Colors from "../common/Colors";
import Styles from "../common/Styles";
import StatusBar from "../components/StatusBar";
import AccountManager from "../managers/AccountManager";
import ApiManager from "../managers/ApiManager";

class EditProfileScreen extends React.Component {
    nameMaxCount = 10;

    constructor(props) {
        super(props);
        this.state = {
            name: AccountManager.getUserProfile().getName(),
            focus: false
        }
    }

    goBack() {
        let goBackAble = this.props.route.params && this.props.route.params.goBackAble;

        console.log(`EditProfileScreen.goBack: goBackAble = ${goBackAble}`);

        this.props.navigation.navigate("TabNavigationScreen");
    }

    onPressCancelButton() {
        console.log("EditProfileScreen.onPressCancelButton");
        this.goBack();
    }

    onPressSaveProfileButton() {
        console.log("EditProfileScreen.onPressSaveProfileButton");

        let userProfile = AccountManager.getUserProfile().clone();
        userProfile.setName(this.state.name);

        ApiManager.setUserProfile(userProfile, ["name", "email", "birth"])
            .then(state => {
                AccountManager.setUserProfile(userProfile);
                AccountManager.saveUserProfile()
                    .then(this.goBack());
            });
    }

    onFocus(value) {
        this.setState({ focus: value });
    }

    render() {
        return (
            <View style={styles.container}>

                {/* 취소(건너뛰기) */}
                <TouchableOpacity style={styles.cancel} activeOpacity={Styles.activeOpacity} onPress={this.onPressCancelButton.bind(this)}>
                    <Text style={styles.cancelText}>건너뛰기</Text>
                </TouchableOpacity>

                <ScrollView style={styles.mainScrollView} contentContainerStyle={styles.mainScrollViewContainer}>
                    <View style={styles.mainContainer}>

                        {/* 설명 */}
                        <Image style={styles.logo} source={require("../../img/pickple_logo.png")} />
                        <Text style={styles.description}>
                            <Text style={styles.descriptionPickple}>Pickple</Text>에서{"\n"}
                            사용할 이름을 정해주세요.

                        </Text>

                        {/* 입력 */}
                        <View style={styles.nameInputContainer}>
                            <TextInput
                                onFocus={this.onFocus.bind(this, true)}
                                onBlur={this.onFocus.bind(this, false)}
                                onChangeText={name => this.setState({ name })}
                                maxLength={this.nameMaxCount}
                                value={this.state.name}
                                placeholder="이름을 입력해주세요"
                                style={[styles.nameInput, this.state.focus ? styles.focusNameInput : null]} />
                            <Text style={styles.nameCounter}>{this.state.name.length}/{this.nameMaxCount}</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* 확인 버튼 */}
                <TouchableOpacity
                    style={styles.confirmButton}
                    activeOpacity={Styles.activeOpacity}
                    onPress={this.onPressSaveProfileButton.bind(this)}>
                    <Text style={styles.confirmButtonText}>시작하기</Text>
                </TouchableOpacity>
                <StatusBar />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        paddingTop: getStatusBarHeight(),
        backgroundColor: Colors.white
    },

    // 취소(건너뛰기) 버튼
    cancel: {
        marginLeft: "auto",
        paddingVertical: 15
    },
    cancelText: {
        ...Styles.textStyle.body04,
        color: Colors.gray03,
        paddingHorizontal: 33
    },

    // 메인
    mainScrollView: {
    },
    mainScrollViewContainer: {
        flexGrow: 1,
        justifyContent: "center"
    },
    mainContainer: {
        justifyContent: "center",
        paddingVertical: 30
    },

    // 설명
    logo: {
        width: 46,
        height: 46,
        marginLeft: 35,
        marginBottom: 14
    },
    description: {
        ...Styles.textStyle.subtitle03,
        marginLeft: 35,
        marginBottom: 96
    },
    descriptionPickple: {
        ...Styles.textStyle.head01,
        fontSize: 20
    },

    // 입력
    nameInputContainer: {
        paddingHorizontal: 35
    },
    nameInput: {
        ...Styles.textStyle.subtitle03,
        borderBottomWidth: 1,
        borderBottomColor: Colors.black05,
        paddingBottom: 12
    },
    focusNameInput: {
        borderBottomColor: Colors.black02,
    },
    nameCounter: {
        ...Styles.textStyle.caption,
        textAlign: "right",
        color: Colors.black05
    },

    // 확인 버튼
    confirmButton: {
        width: "100%",
        paddingTop: 26,
        paddingBottom: Platform.OS == "android" ? 26 : 50,
        alignItems: "center",
        backgroundColor: Colors.primary01
    },
    confirmButtonText: {
        ...Styles.textStyle.body05
    }
});

export default EditProfileScreen;