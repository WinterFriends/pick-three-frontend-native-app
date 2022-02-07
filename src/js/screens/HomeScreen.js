import React from "react";
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import DateUtils from "../utils/DateUtils";
import Goal from "../common/Goal";
import UserGoal from "../common/UserGoal";
import UserGoalListElement from "../components/UserGoalListElement";
import StatusBar from "../components/StatusBar.js"
import GoalManager from "../managers/GoalManager";
import ApiManager from "../managers/ApiManager";
import CalendarDayElement from "../components/CalendarDayElement";
import UserGoalUtils from "../utils/UserGoalUtils";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Styles from "../common/Styles";
import Colors from "../common/Colors";

class HomeScreen extends React.Component {
    key = 0;

    constructor(props) {
        super(props);
        console.log("HomeScreen.constructor");

        let currentDate = new Date();
        let currentDateString = DateUtils.dateToFormattedString(currentDate);

        this.state = {
            init: false,
            todayDateString: currentDateString,
            targetDate: currentDate,                // 선택된 날짜(Date)   
            targetDateString: currentDateString,    // 선택된 날짜(string)
            userGoalListByDate: {}, // 7일간의 UserGoal(diary 없음)이 날짜(key)를 기준으로 담긴 객체
            userGoalList: []        // 선택된 날짜의 UserGoal이 남긴 배열
        }
    }

    componentDidMount() {
        console.log("HomeScreen.componentDidMount");

        // 화면 포커스 이벤트 리스너 등록
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            console.log("HomeScreen.onFocus");

            // 처음 호출인지에 따른 분기
            if (this.state.init)
                this.updateTargetDate(this.state.targetDateString);
            else {
                this.setState({ init: true });

                // 오늘 날짜로 변경
                let currentDate = new Date();
                let currentDateString = DateUtils.dateToFormattedString(currentDate);
                this.updateTargetDate(currentDateString);
            }
        });
    }

    componentWillUnmount() {
        console.log("HomeScreen.componentWillUnmount");

        this.unsubscribe();
    }

    checkSelectGoal() {
        return this.state.userGoalList.length != 0;
    }

    /**
     * 날짜를 선택했을 때 사용하는 함수
     * @param {string} date 
     */
    updateTargetDate(date) {
        console.log("HomeScreen.updateTargetDate:", date);

        this.setState({
            targetDate: DateUtils.formattedStringToDate(date),
            targetDateString: date
        });
        this.updateUserGoalContent(date);   // 선택된 날짜에 대한 시용자 목표 내용 업데이트
        this.updateCalendar(date);          // 7일치 달력 업데이트
    }

    /**
     * 7일간의 달력을 업데이트 해주는 함수
     * @param {string} date
     */
    updateCalendar(date) {
        console.log("HomeScreen.updateCalendar:", date);

        // 선택된 날짜
        let targetDate = DateUtils.formattedStringToDate(date);   // string -> Date

        // 1일간의 밀리초
        let dateOffset = (24 * 60 * 60 * 1000);

        // 3일 전 Date 계산 (시작 날짜)
        let startDateTime = targetDate.getTime() - dateOffset * 3;
        let startDate = new Date(startDateTime);
        let startDateString = DateUtils.dateToFormattedString(startDate);

        // 달력 업데이트
        ApiManager.getUserGoalListByDate(startDateString, 7, ["success"])
            .then(userGoalListByDate => this.setState({ userGoalListByDate }));
    }

    /**
     * 선택한 날짜의 사용자 목표에 대한 내용을 업데이트하는 함수 (UI 업데이트)
     * @param {string} date
     */
    updateUserGoalContent(date) {
        console.log("HomeScreen.updateUserGoalContent");

        ApiManager.getUserGoalListByDate(date, 1, ["success", "diary"])
            .then(userGoalListByDate => this.setState({ userGoalList: UserGoalUtils.sortUserGoalListByGoalId(userGoalListByDate[date]) }));
    }

    onPressSelectGoalButton() {
        this.props.navigation.navigate(
            "SelectGoalScreen",
            {
                date: this.state.targetDateString,
                selectedGoalIdList: UserGoalUtils.getSelectedGoalIdList(this.state.userGoalList)
            }
        );
    }

    onPressWriteDiaryButton() {
        this.props.navigation.navigate(
            "WriteDiaryScreen",
            {
                date: this.state.targetDateString,
                userGoalList: this.state.userGoalList
            }
        );
    }

    /**
     * 성공 여부가 변경되었을 때, UserGoalListElement에 의해 호출되는 함수
     * @param {userGoal} userGoal 
     */
    onChangeUserGoalSuccess(userGoal) {
        console.log(`MainPage.onChangeUserGoalSuccess: ${userGoal.getSuccess()} (${GoalManager.getGoalById(userGoal.getGoalId()).getName()})`);

        let goalId = userGoal.getGoalId();
        let goal = GoalManager.getGoalById(goalId);

        // 빠른 내용 적용
        let userGoalListByDate = this.state.userGoalListByDate;
        userGoalListByDate[this.state.targetDateString] = this.state.userGoalList;
        this.setState({
            userGoalListByDate: { ...userGoalListByDate }
        });

        // 서버 내용 적용
        ApiManager.setUserGoalDetailByDate(this.state.targetDateString, this.state.userGoalList, ["success"]);
        // .then(status => this.updateTargetDate(this.state.targetDateString));
    }

    /**
     * 다이어리에서 날짜를 눌렀을 때 호출되는 함수
     * @param {string} date 
     */
    onPressDiaryDayElement(date) {
        console.log(`MainPage.onPressDiaryDayElement: ${date}`);

        this.updateTargetDate(date);
    }

    render() {
        return (
            <View style={styles.container} >
                {/* 상단바 */}
                <View style={styles.topbar}>
                    < View style={styles.buttons} >
                        {/* 일기 작성 버튼 */}
                        {
                            this.checkSelectGoal()
                                ? <TouchableOpacity
                                    activeOpacity={Styles.activeOpacity}
                                    style={{ ...styles.button, marginRight: 25, marginLeft: "auto" }}
                                    onPress={this.onPressWriteDiaryButton.bind(this)}>
                                    <Image title="Write Diary" source={require("../../img/write_diary_btn.png")} style={styles.buttonImage} />
                                </TouchableOpacity>
                                : null
                        }

                        {/* 목표 선택 버튼 */}
                        <TouchableOpacity
                            activeOpacity={Styles.activeOpacity}
                            style={{ ...styles.button, marginLeft: this.checkSelectGoal() ? 0 : "auto" }}
                            onPress={this.onPressSelectGoalButton.bind(this)}>
                            < Image title="Select Goal" source={require("../../img/select_goal_btn.png")} style={styles.buttonImage} />
                        </TouchableOpacity>
                    </View >

                    {/* 선택된 날짜 */}
                    <Text style={styles.monthAndDay}>{this.state.targetDate.getMonth() + 1}월 {this.state.targetDate.getDate()}일</Text>
                </View>

                {/* 캘린더 */}
                <View>
                    <View style={styles.calendar}>

                        {/* 요일 */}
                        <View style={{ ...styles.calendarRow, marginBottom: 9, color: Colors.black03 }}>
                            {
                                Object.keys(this.state.userGoalListByDate).map(date => <Text key={this.key++} style={styles.calendarRowItem}>{DateUtils.getDayOfWeek(DateUtils.formattedStringToDate(date))}</Text>)
                            }
                        </View>

                        {/* 날짜 */}
                        <View style={styles.calendarRow}>
                            {
                                Object.keys(this.state.userGoalListByDate).map(date => {
                                    let userGoalList = this.state.userGoalListByDate[date];
                                    return <CalendarDayElement
                                        key={this.key++}
                                        date={date}
                                        today={date == this.state.todayDateString}
                                        selected={date == this.state.targetDateString}
                                        successGoalIdList={UserGoalUtils.getSuccessGoalIdList(userGoalList)}
                                        onPress={this.onPressDiaryDayElement.bind(this)} />
                                })
                            }
                        </View>
                    </View>
                </View>

                {/* 사용자 목표 내용 */}
                {
                    this.checkSelectGoal()
                        ? <ScrollView style={styles.userGoalList} contentContainerStyle={styles.userGoalListContainer}>
                            {
                                this.state.userGoalList.map(userGoal =>
                                    <UserGoalListElement
                                        key={this.key++}
                                        userGoal={userGoal}
                                        goal={GoalManager.getGoalById(userGoal.getGoalId())}
                                        onChangeUserGoalSuccess={this.onChangeUserGoalSuccess.bind(this)}
                                    />
                                )
                            }
                        </ScrollView>

                        : <View style={{ ...styles.userGoalList, justifyContent: "center", alignItems: "center" }}>
                            <View style={{ justifyContent: "center", alignItems: "center" }} >
                                <TouchableOpacity
                                    activeOpacity={Styles.activeOpacity}
                                    onPress={this.onPressSelectGoalButton.bind(this)}>
                                    <Image source={require("../../img/select_goal_circle_btn.png")} style={{ width: 50, height: 50, marginBottom: 17 }} />
                                </TouchableOpacity>
                                <Text style={Styles.textStyle.body01}>오늘의 세 가지를 선택하세요</Text>
                            </View>
                        </View>
                }
                <StatusBar />
            </View >
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
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 25
    },
    button: {
        paddingVertical: 15
    },
    buttonImage: {
        width: 24,
        height: 24
    },
    monthAndDay: {
        ...Styles.textStyle.body01,
        position: "absolute",
        marginLeft: 25
    },

    // 캘린더
    calendar: {
        width: "100%",
        paddingTop: 9,
        paddingHorizontal: 18,
        paddingBottom: 22
    },
    calendarRow: {
        width: "100%",
        flexDirection: "row"
    },
    calendarRowItem: {
        ...Styles.textStyle.body02,
        flex: 1,
        textAlign: "center"
    },

    // 사용자 목표
    userGoalList: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: Colors.background,
    },
    userGoalListContainer: {
        paddingVertical: 21,
        paddingHorizontal: 20
    }
});

export default HomeScreen;