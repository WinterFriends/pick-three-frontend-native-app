import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Colors from "../common/Colors";
import Styles from "../common/Styles";
import CalendarDayElement from "../components/CalendarDayElement";
import UserGoalListElement from "../components/UserGoalListElement";
import ApiManager from "../managers/ApiManager";
import GoalManager from "../managers/GoalManager";
import DateUtils from "../utils/DateUtils";
import UserGoalUtils from "../utils/UserGoalUtils";

const dayOfWeekList = ["일", "월", "화", "수", "목", "금", "토"];

class CalendarScreen extends React.Component {
    key = 0;

    constructor(props) {
        super(props);

        let currentDate = new Date();
        let currentDateString = DateUtils.dateToFormattedString(currentDate);

        this.state = {
            init: false,
            todayDateString: currentDateString,
            targetYear: currentDate.getFullYear(),
            targetMonth: currentDate.getMonth() + 1,
            targetDate: currentDate,
            targetDateString: currentDateString,
            userGoalListByDate: {},
            userGoalList: []
        };
    }

    componentDidMount() {
        console.log("CalendarScreen.componentDidMount");

        // 화면 포커스 이벤트 리스너 등록
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            console.log("CalendarScreen.onFocus");

            // 처음 호출인지에 따른 분기
            if (this.state.init) {
                this.updateCalendar(this.state.targetYear, this.state.targetMonth);
                this.updateUserGoalContent(this.state.targetDateString);
            }
            else {
                this.setState({ init: true });

                // 달력 업데이트
                let currentDate = new Date();
                let currentYear = currentDate.getFullYear();
                let currentMonth = currentDate.getMonth() + 1;
                this.updateCalendar(currentYear, currentMonth);
                this.updateUserGoalContent(DateUtils.dateToFormattedString(currentDate));
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    checkSelectGoal() {
        return this.state.userGoalList.length != 0;
    }

    /**
     * 캘린더를 업데이트하는 함수
     * @param {number} year 
     * @param {number} month 
     */
    updateCalendar(year, month) {
        // 변수 초기화
        let firstDate = new Date(year, month - 1, 1);
        let firstDateString = DateUtils.dateToFormattedString(firstDate);
        let dayCountOfMonth = DateUtils.getLastDayOfMonth(year, month);

        // state 적용
        this.setState({
            targetYear: year,
            targetMonth: month,
            weekCount: DateUtils.getWeekCountOfMonth(year, month),
            firstDayOfWeek: firstDate.getDay()
        });

        // API 호출
        ApiManager.getUserGoalListByDate(firstDateString, dayCountOfMonth, ["success"])
            .then(userGoalListByDate => {
                this.setState({ userGoalListByDate });
                console.log("CalendarScreen.updateCalendar");
            });

    }

    /**
     * 선택한 날짜의 사용자 목표에 대한 내용을 업데이트하는 함수 (UI 업데이트)
     * @param {string} date
     */
    updateUserGoalContent(date) {
        this.setState({
            targetDate: DateUtils.formattedStringToDate(date),
            targetDateString: date
        })
        ApiManager.getUserGoalListByDate(date, 1, ["success", "diary"])
            .then(userGoalListByDate => {
                this.setState({
                    userGoalList: UserGoalUtils.sortUserGoalListByGoalId(userGoalListByDate[date])
                });
            });
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
     * 월 선택기의 버튼(좌, 우)를 눌렀을 때 호출되는 함수
     * @param {number}} dir 
     */
    onPressMonthSelectorButton(dir) {
        let newMonth = this.state.targetMonth + dir;
        let newYear = this.state.targetYear;

        if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }
        else if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        }

        console.log(`CalendarScreen.onPressMonthSelectorButton: ${newYear}.${newMonth}`);

        this.updateCalendar(newYear, newMonth);

        let newDate = new Date(newYear, newMonth - 1, 1);
        let currentDate = new Date();

        let newDateString = "";

        if (newDate.getFullYear() == currentDate.getFullYear() && newDate.getMonth() == currentDate.getMonth())
            newDateString = this.state.todayDateString;
        else
            newDateString = DateUtils.dateToFormattedString(newDate);

        this.updateUserGoalContent(newDateString)
    }

    /**
    * 성공 여부가 변경되었을 때, UserGoalListElement에 의해 호출되는 함수
    * @param {userGoal} userGoal 
    */
    onChangeUserGoalSuccess(userGoal) {
        console.log(`MainPage.onChangeUserGoalSuccess: ${userGoal.getSuccess()} (${GoalManager.getGoalById(userGoal.getGoalId()).getName()})`);

        let goalId = userGoal.getGoalId();
        let goal = GoalManager.getGoalById(userGoal.getGoalId());

        // 빠른 내용 적용
        let userGoalListByDate = this.state.userGoalListByDate;
        userGoalListByDate[this.state.targetDateString] = this.state.userGoalList;
        this.setState({
            userGoalListByDate: { ...userGoalListByDate }
        });

        // // 서버 내용 적용
        ApiManager.setUserGoalDetailByDate(this.state.targetDateString, this.state.userGoalList, ["success"]);
        //     .then(status => this.updateCalendar(this.state.targetYear, this.state.targetMonth));
    }

    /**
     * 다이어리에서 날짜를 눌렀을 때 호출되는 함수
     * @param {string} date 
     */
    onPressDiaryDayElement(date) {
        this.updateUserGoalContent(date);
        console.log(`CalendarScreen.onPressDiaryDayElement: ${date}`);
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 상단바 */}
                <View style={styles.topbar}>
                    <View style={styles.buttons}>
                        {/* 일기 작성 버튼 */}
                        {
                            this.checkSelectGoal()
                                ? <TouchableOpacity
                                    activeOpacity={Styles.activeOpacity}
                                    style={{ ...styles.button, marginRight: 13, marginLeft: "auto" }}
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
                            <Image title="Select Goal" source={require("../../img/select_goal_btn.png")} style={styles.buttonImage} />
                        </TouchableOpacity>
                    </View >

                    {/* 타이틀 */}
                    <Text style={styles.title}>Calendar</Text>
                </View>

                {/* 스크롤 뷰 */}
                <ScrollView style={styles.mainScrollView} contentContainerStyle={{ flexGrow: 1 }} bounces={false} overScrollMode="never">
                    {/* 월 선택기 */}
                    <View style={styles.monthSelector}>
                        <TouchableOpacity style={styles.monthSelectorButton} activeOpacity={Styles.activeOpacity} onPress={this.onPressMonthSelectorButton.bind(this, -1)}>
                            <Image style={styles.monthSelectorButtonImage} source={require("../../img/left_arrow.png")} />
                        </TouchableOpacity>

                        <Text style={styles.currentMonth}>{this.state.targetYear}년 {this.state.targetMonth}월</Text>

                        <TouchableOpacity style={styles.monthSelectorButton} activeOpacity={Styles.activeOpacity} onPress={this.onPressMonthSelectorButton.bind(this, 1)}>
                            <Image style={styles.monthSelectorButtonImage} source={require("../../img/right_arrow.png")} />
                        </TouchableOpacity>
                    </View>


                    {/* 캘린더 */}
                    <View style={styles.calendar}>

                        {/* 요일 */}
                        <View style={{ ...styles.calendarRow, marginBottom: 9, color: Colors.black03 }}>
                            {
                                dayOfWeekList.map(
                                    dayOfWeek => <Text key={this.key++} style={styles.calendarRowItem}>{dayOfWeek}</Text>
                                )
                            }
                        </View>

                        {/* 날짜 */}
                        {
                            [...Array(this.state.weekCount)].map((_, weekIndex) => {
                                const dayCountOfWeek = 7;
                                const dateList = Object.keys(this.state.userGoalListByDate);
                                return (
                                    <View key={this.key++} style={styles.calendarRow}>
                                        {
                                            [...Array(dayCountOfWeek)].map((_, dayOfWeek) => {
                                                let targetDay = weekIndex * dayCountOfWeek + dayOfWeek - this.state.firstDayOfWeek + 1;
                                                let targetDateString = dateList[targetDay - 1];

                                                if (targetDay < 1 || targetDay > this.state.lastDay || !this.state.userGoalListByDate.hasOwnProperty(targetDateString))    // 쓰레기 값 빈 칸 처리
                                                    return (<View key={this.key++} style={CalendarDayElement.rootStyle()}></View>);
                                                else
                                                    return (
                                                        <CalendarDayElement
                                                            key={this.key++}
                                                            date={targetDateString}
                                                            today={targetDateString == this.state.todayDateString}
                                                            successGoalIdList={UserGoalUtils.getSuccessGoalIdList(this.state.userGoalListByDate[targetDateString])}
                                                            selected={targetDateString == this.state.targetDateString}
                                                            onPress={this.onPressDiaryDayElement.bind(this)}
                                                        />);
                                            })
                                        }
                                    </View>
                                );
                            })
                        }
                    </View>

                    {/* 사용자 목표 내용 */}
                    {
                        this.checkSelectGoal()
                            ? <View style={{ ...styles.userGoalList, ...styles.userGoalListContainer }} >
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
                            </View>

                            : <View style={{ ...styles.userGoalList, justifyContent: "center", alignItems: "center", paddingVertical: 30 }}>
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
                </ScrollView>
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
    title: {
        ...Styles.textStyle.head02,
        position: "absolute",
        marginLeft: 25
    },

    // 메인 스크롤
    mainScrollView: {
        flex: 1,
        width: "100%",
    },

    // 월 선택기
    monthSelector: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    currentMonth: {
        ...Styles.textStyle.subtitle01,
    },
    monthSelectorButton: {
        paddingHorizontal: 25,
        paddingVertical: 10
    },
    monthSelectorButtonImage: {
        width: 24,
        height: 24
    },

    // 캘린더
    calendar: {
        width: "100%",
        paddingTop: 10,
        paddingHorizontal: 11,
        paddingBottom: 19
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
        flex: 1,
        width: "100%",
        backgroundColor: Colors.background,
    },
    userGoalListContainer: {
        paddingVertical: 21,
        paddingHorizontal: 20
    }
});

export default CalendarScreen;