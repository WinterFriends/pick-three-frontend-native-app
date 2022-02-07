import React from "react";
import { View, Text, Button, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Colors from "../common/Colors";
import Goal from "../common/Goal"
import Styles from "../common/Styles";
import UserGoal from "../common/UserGoal";
import GoalListElement from "../components/GoalListElement";
import StatusBar from "../components/StatusBar";
import ApiManager from "../managers/ApiManager";
import GoalManager from "../managers/GoalManager";
import DateUtils from "../utils/DateUtils";

class SelectGoalScreen extends React.Component {
    key = 0;

    constructor(props) {
        console.log("SelectGoalScreen.constructor");
        super(props);

        let dateString = props.route.params.date;
        let date = DateUtils.formattedStringToDate(dateString);
        this.goalList = GoalManager.getGoalList();

        this.state = {
            dateString: dateString,
            date: date,
            selectedGoalIdList: props.route.params.selectedGoalIdList
        };
    }

    onPressGoalListElement(goal) {
        console.log(`SelectGoalScreen.onPressGoalListElement: ${goal.getId()} (${goal.getName()})`);

        let index = this.state.selectedGoalIdList.indexOf(goal.getId());

        // 포함되어 있으면 삭제
        if (index > -1)
            this.setState(state => {
                let newList = [...state.selectedGoalIdList];
                newList.splice(index, 1);
                return { selectedGoalIdList: newList };
            });
        // 포함되어 있지 않고, 3개 이하면
        else if (this.state.selectedGoalIdList.length < 3)
            this.setState(state => ({ selectedGoalIdList: [...state.selectedGoalIdList, goal.getId()] }));
    }

    onPressConfirmButton() {
        if (this.state.selectedGoalIdList.length === 3) {
            let userGoalList = [];

            this.state.selectedGoalIdList.map(goalId => userGoalList.push(new UserGoal(this.state.dateString, goalId, true, "")));

            ApiManager.setUserGoalDetailByDate(this.state.dateString, userGoalList, [])
                .then(this.props.navigation.goBack(null));
        }
    }

    onPressBackButton() {
        this.props.navigation.goBack(null);
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
                    <Text style={styles.title}>Today's PICK</Text>
                    <Text style={styles.titleCaption}>오늘의 세 가지를 선택해주세요.</Text>
                </View>

                {/* 목표 리스트 */}
                <ScrollView style={styles.goalList} contentContainerStyle={styles.goalListContainer}>
                    {
                        this.goalList.map(goal => {
                            return <GoalListElement
                                key={this.key++}
                                goal={goal}
                                selected={this.state.selectedGoalIdList.indexOf(goal.getId()) > -1 ? true : false}
                                onPress={this.onPressGoalListElement.bind(this)} />;
                        })
                    }
                </ScrollView>

                {/* 확인 버튼 */}
                <TouchableOpacity style={[styles.confirmButton, this.state.selectedGoalIdList.length == 3 ? styles.activeConfirmButton : null]} activeOpacity={Styles.activeOpacity} onPress={this.onPressConfirmButton.bind(this)}>


                    {
                        this.state.selectedGoalIdList.length === 0
                            ? <Text style={styles.confirmButtonText}>오늘의 목표를 선택해주세요</Text>
                            : <Text style={styles.confirmButtonText}>오늘의 {
                                this.state.selectedGoalIdList.length >= 3
                                    ? <Text style={styles.confirmButtonTextBold}>세 가지</Text>
                                    : this.state.selectedGoalIdList.length == 2
                                        ? <Text style={styles.confirmButtonTextBold}>두 가지</Text>
                                        : this.state.selectedGoalIdList.length == 1
                                            ? <Text style={styles.confirmButtonTextBold}>한 가지</Text>
                                            : ""
                            } 선택 완료!</Text>
                    }

                </TouchableOpacity>

                <StatusBar />
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

    // 목표 리스트
    goalList: {
        flexGrow: 1,
        width: "100%"
    },
    goalListContainer: {
        paddingTop: 37,
        paddingHorizontal: 35
    },

    // 확인 버튼
    confirmButton: {
        width: "100%",
        paddingVertical: 26,
        alignItems: "center",
        backgroundColor: Colors.gray01
    },
    activeConfirmButton: {
        backgroundColor: Colors.primary01
    },
    confirmButtonText: {
        ...Styles.textStyle.body05
    },
    confirmButtonTextBold: {
        fontFamily: "Pretendard-SemiBold"
    }
});

export default SelectGoalScreen;