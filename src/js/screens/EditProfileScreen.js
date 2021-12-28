import React from "react";
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import StatusBar from "../components/StatusBar";

class EditProfileScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    goBack() {
        let goBackAble = this.props.route.params && this.props.route.params.goBackAble;

        console.log(`EditProfileScreen.goBack: goBackAble = ${goBackAble}`);

        if (goBackAble)
            this.props.navigation.goBack(null);
        else
            this.props.navigation.navigate("TabNavigationScreen");
    }

    onPressCancelButton() {
        console.log("EditProfileScreen.onPressCancelButton");
        this.goBack();
    }

    onPressSaveProfileButton() {
        console.log("EditProfileScreen.onPressSaveProfileButton");
        // Save
        this.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.onPressCancelButton.bind(this)}>
                    <Text>건너뛰기</Text>
                </TouchableOpacity>

                <Text>픽플을 시작하기 위한</Text>
                <Text>기본 정보를 입력해주세요.</Text>


                <Text>닉네임</Text>
                <TextInput placeholder="닉네임을 입력해주세요" />

                <Text>생년월일</Text>
                <TextInput placeholder="생년월일을 입력해주세요" />

                <Button title="픽플 시작하기" onPress={this.onPressSaveProfileButton.bind(this)} />

                <StatusBar />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20
    }
});

export default EditProfileScreen;