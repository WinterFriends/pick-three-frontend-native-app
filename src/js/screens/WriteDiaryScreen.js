import React from "react";
import { View, Text, Button, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform, KeyboardAvoidingView } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Colors from "../common/Colors";
import Goal from "../common/Goal";
import Styles from "../common/Styles";
import UserGoal from "../common/UserGoal";
import UserGoalDiaryElement from "../components/UserGoalDiaryElement";
import ApiManager from "../managers/ApiManager";
import GoalManager from "../managers/GoalManager";
import DateUtils from "../utils/DateUtils";

class WriteDiaryScreen extends React.Component {
    key = 0;

    constructor(props) {
        super(props);

        let dateString = props.route.params.date;
        let date = DateUtils.formattedStringToDate(dateString);

        this.state = {
            userGoalList: props.route.params.userGoalList,
            dateString: dateString,
            date: date
        }
    }

    onPressBackButton() {
        this.props.navigation.goBack(null);
    }

    onPressConfirmButton() {
        ApiManager.setUserGoalDetailByDate(this.props.route.params.date, this.state.userGoalList, ["diary"])
            .then(status => this.props.navigation.goBack(null));
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 상단바 */}
                <View style={styles.topbar}>
                    <TouchableOpacity
                        activeOpacity={Styles.activeOpacity}
                        style={styles.button}
                        onPress={this.onPressBackButton.bind(this)}>
                        <Image source={require("../../img/back_btn.png")} style={styles.buttonImage} />
                    </TouchableOpacity>
                    <Text style={styles.monthAndDay}>{this.state.date.getMonth() + 1}월 {this.state.date.getDate()}일</Text>
                </View>

                {/* 타이틀 */}
                <View style={styles.titleContainer}>
                    <View style={styles.titleCircle}></View>
                    <Text style={styles.title}>Today's DIARY</Text>
                    <Text style={styles.titleCaption}>오늘의 일기를 작성해주세요.</Text>
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1, width: "100%" }}
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <ScrollView style={styles.userGoalDiaryList} contentContainerStyle={styles.userGoalDiaryListContainer}>
                        {
                            this.state.userGoalList.map(userGoal => {
                                return <UserGoalDiaryElement
                                    key={this.key++}
                                    userGoal={userGoal}
                                    goal={GoalManager.getGoalById(userGoal.getGoalId())}
                                />;
                            })
                        }
                    </ScrollView>
                </KeyboardAvoidingView>

                <TouchableOpacity style={styles.confirmButton} activeOpacity={Styles.activeOpacity} onPress={this.onPressConfirmButton.bind(this)}>
                    <Text style={styles.confirmButtonText}>저장</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        paddingTop: getStatusBarHeight(),
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: Colors.white
    },

    // 상단바
    topbar: {
        width: "100%",
        justifyContent: "center"
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 21,
        marginRight: "auto"
    },
    buttonImage: {
        width: 24,
        height: 24
    },
    monthAndDay: {
        ...Styles.textStyle.body01,
        position: "absolute",
        alignSelf: "center"
    },

    // 타이틀
    titleContainer: {
        alignSelf: "center"
    },
    titleCircle: {
        position: "absolute",
        left: -22,
        width: 48,
        height: 48,
        borderRadius: 100,
        backgroundColor: Colors.primary01
    },
    title: {
        ...Styles.textStyle.head01,
        marginTop: 14,
        marginBottom: 4
    },
    titleCaption: {
        ...Styles.textStyle.body06,
        alignSelf: "center",
        color: Colors.black06
    },

    // 사용자 목표 리스트
    userGoalDiaryList: {
        flex: 1,
        width: "100%"
    },
    userGoalDiaryListContainer: {
        paddingTop: 27,
        paddingHorizontal: 35
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

export default WriteDiaryScreen;