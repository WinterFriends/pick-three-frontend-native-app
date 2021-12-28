import React from "react";
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import StatusBar from "../components/StatusBar";

class EditProfileScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate("TabNavigationScreen") }}>
                    <Text>건너뛰기</Text>
                </TouchableOpacity>

                <Text>픽플을 시작하기 위한</Text>
                <Text>기본 정보를 입력해주세요.</Text>


                <Text>닉네임</Text>
                <TextInput placeholder="닉네임을 입력해주세요" />

                <Text>생년월일</Text>
                <TextInput placeholder="생년월일을 입력해주세요" />

                <Button title="픽플 시작하기" />

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