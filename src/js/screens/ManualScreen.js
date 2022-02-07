import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Colors from "../common/Colors";
import Styles from "../common/Styles";
import StatusBar from "../components/StatusBar";

class ManualScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    renderItem({ item }) {
        return (
            <View key={item.key} style={styles.itemContainer}>
                {item.text}
                <Image style={styles.itemImage} source={item.image} />
            </View>
        );
    }

    onDone() {
        // 프로필 변경 스크린으로 이동
        this.props.navigation.replace("EditProfileScreen");
    }

    render() {
        return (
            <View style={styles.container}>
                <AppIntroSlider
                    renderItem={this.renderItem.bind(this)}
                    data={slides}
                    onDone={this.onDone.bind(this)}
                    onSkip={this.onDone.bind(this)}
                    nextLabel="다음"
                    doneLabel="확인"
                    dotStyle={{ backgroundColor: Colors.black05 }}
                    activeDotStyle={{ backgroundColor: Colors.primary01 }}
                    renderNextButton={() => (<Text style={styles.button}>다음</Text>)}
                    renderDoneButton={() => (<Text style={styles.button}>완료</Text>)} />
                <StatusBar />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        paddingTop: getStatusBarHeight(),
        backgroundColor: Colors.background
    },
    itemContainer: {
        flex: 1,
        justifyContent: "center",
    },
    itemImage: {
        width: 375,
        height: 262,
        marginVertical: 45,
        alignSelf: "center"
    },
    itemDescription: {
        paddingLeft: 35,
        fontFamily: "Pretendard-Regular",
        fontSize: 25,
        lineHeight: 35
    },
    itemDescriptionBold: {
        fontFamily: "Pretendard-SemiBold",
    },
    button: {
        ...Styles.textStyle.body05,
        textAlign: "center",
        padding: 12
    }
});

const slides = [
    {
        key: 1,
        text: (
            <Text style={styles.itemDescription}>오늘 하루 집중할{"\n"}<Text style={styles.itemDescriptionBold}>세 가지 목표를 선택</Text>해요</Text>
        ),
        image: require("../../img/manual_1.png"),
        backgroundColor: "#59b2ab",
    },
    {
        key: 2,
        text: (
            <Text style={styles.itemDescription}><Text style={styles.itemDescriptionBold}>더블 탭</Text>하여{"\n"}목표를 완료해요</Text>
        ),
        image: require("../../img/manual_2.png"),
        backgroundColor: "#febe29",
    },
    {
        key: 3,
        text: (
            <Text style={styles.itemDescription}><Text style={styles.itemDescriptionBold}>일기를 작성</Text>하며{"\n"}하루를 돌아봐요</Text>
        ),
        image: require("../../img/manual_3.png"),
        backgroundColor: "#22bcb5",
    }
];

export default ManualScreen;