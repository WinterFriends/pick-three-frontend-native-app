import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Colors from "../common/Colors";
import Goal from "../common/Goal";
import Styles from "../common/Styles";
import ApiManager from "../managers/ApiManager";
import GoalManager from "../managers/GoalManager";
import DateUtils from "../utils/DateUtils";
import UserGoalUtils from "../utils/UserGoalUtils";

const buttonImage = {
    "month": require("../../img/week_btn.png"),
    "week": require("../../img/month_btn.png")
};

class ReportScreen extends React.Component {
    key = 0;

    constructor(props) {
        super(props);

        let currentDate = new Date();
        let startDate = DateUtils.getFirstDayOfWeek(currentDate);
        let startDateString = DateUtils.dateToFormattedString(startDate);

        let weekNumberObj = DateUtils.getWeekNumberByMonth(startDate);
        let targetYear = weekNumberObj.year;
        let targetMonth = weekNumberObj.month;
        let targetWeek = weekNumberObj.weekNo;

        this.state = {
            init: false,
            unit: "week",       // week or month
            targetYear,         // 해당년
            targetMonth,        // 헤달월
            targetWeek,         // 해당주가 몇 주인지 or 1
            startDate,          // 해당주의 시작일 or 해당월의 시작일
            startDateString,    // 해당주의 시작일 or 해당월의 시작일 (문자열)
            dateCount: 7,       // 7 or 29~31
            report: {}
        };
    }

    componentDidMount() {
        // 화면 포커스 이벤트 리스너 등록
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            console.log("ReportScreen.onFocus");

            // 처음 호출인지에 따른 분기
            if (this.state.init)
                this.updateReport(this.state.startDateString, this.state.dateCount);
            else {
                // 오늘 날짜로 변경
                this.updateReport(this.state.startDateString, this.state.dateCount);
            }
        });
    }

    componentWillUnmount() {
        console.log("ReportScreen.componentWillUnmount");

        this.unsubscribe();
    }

    updateReport(startDate, dateCount) {
        ApiManager.getUserGoalListByDate(startDate, dateCount, ["success"])
            .then(userGoalListByDate => {
                let report = UserGoalUtils.getReport(GoalManager.getGoalIdList(), userGoalListByDate);
                this.setState({
                    init: true,
                    report
                })
            });
    }

    onPressChangeUnitButton() {
        let unit = this.state.unit == "week" ? "month" : "week";

        this.setState({
            unit: unit,
        }, () => this.onPressMonthSelectorButton(0));
    }

    /**
     * 월 선택기의 버튼(좌, 우)를 눌렀을 때 호출되는 함수
     * @param {number}} dir 
     */
    onPressMonthSelectorButton(dir) {
        let targetYear,
            targetMonth,
            targetWeek,
            startDate,
            startDateString,
            dateCount;

        if (this.state.unit == "week") {
            const offset = 86400000 * 7;    // 7일 밀리초

            startDate = this.state.startDate;
            startDate = DateUtils.getFirstDayOfWeek(startDate);
            startDate = new Date(startDate.getTime() + offset * dir);
            startDateString = DateUtils.dateToFormattedString(startDate);

            let weekNumberObj = DateUtils.getWeekNumberByMonth(startDate);
            targetYear = weekNumberObj.year;
            targetMonth = weekNumberObj.month;
            targetWeek = weekNumberObj.weekNo;
            dateCount = 7;
        }
        else {  // month
            targetYear = this.state.targetYear;
            targetMonth = this.state.targetMonth + dir;
            targetWeek = 1;
            if (targetMonth > 12) {
                targetMonth = 1;
                targetYear++;
            }
            else if (targetMonth < 1) {
                targetMonth = 12;
                targetYear--;
            }

            startDate = new Date(targetYear, targetMonth - 1, 1);
            startDateString = DateUtils.dateToFormattedString(startDate);
            dateCount = DateUtils.getLastDayOfMonth(targetYear, targetMonth);
        }

        this.setState({
            targetYear,
            targetMonth,
            targetWeek,
            startDate,
            startDateString,
            dateCount
        });

        this.updateReport(startDateString, dateCount);
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 상단바 */}
                <View style={styles.topbar}>
                    <View style={styles.buttons}>
                        {/* 단위 변경 버튼 */}
                        <TouchableOpacity
                            activeOpacity={Styles.activeOpacity}
                            style={styles.button}
                            onPress={this.onPressChangeUnitButton.bind(this)}>
                            <Image title="Select Goal" source={buttonImage[this.state.unit]} style={styles.buttonImage} />
                        </TouchableOpacity>
                    </View >

                    {/* 타이틀 */}
                    <Text style={styles.title}>Report</Text>
                </View>

                {/* 월 선택기 */}
                <View style={styles.monthSelector}>
                    <TouchableOpacity style={styles.monthSelectorButton} activeOpacity={Styles.activeOpacity} onPress={this.onPressMonthSelectorButton.bind(this, -1)}>
                        <Image style={styles.monthSelectorButtonImage} source={require("../../img/left_arrow.png")} />
                    </TouchableOpacity>

                    <Text style={styles.currentMonth}>{this.state.targetYear}년 {this.state.targetMonth}월{this.state.unit == "week" ? ` ${this.state.targetWeek}주` : ""}</Text>

                    <TouchableOpacity style={styles.monthSelectorButton} activeOpacity={Styles.activeOpacity} onPress={this.onPressMonthSelectorButton.bind(this, 1)}>
                        <Image style={styles.monthSelectorButtonImage} source={require("../../img/right_arrow.png")} />
                    </TouchableOpacity>
                </View>

                {/* 스크롤 뷰 */}
                <ScrollView style={styles.mainScrollView} contentContainerStyle={styles.mainScrollViewContainer}>
                    {/* 성공한 목표 */}
                    <Text style={styles.subTitle}>성공한 목표</Text>
                    <View style={[styles.graphContainer, styles.goalSuccessContainer]}>
                        <View style={styles.goalSuccessGrahp}>
                            {
                                this.state.init
                                    ? GoalManager.getGoalList().map(goal => {
                                        let goalId = goal.getId();
                                        let count = this.state.report.success.countByGoalId[goalId];
                                        return (
                                            <View key={this.key++} style={{
                                                ...styles.goalSuccessGrahpElement,
                                                width: `${count / this.state.report.success.totalCount * 100}%`,
                                                backgroundColor: GoalManager.getGoalById(goalId).getMainColor()
                                            }}></View>
                                        );
                                    })
                                    : null
                            }
                        </View>

                        <View style={styles.goalSuccessIconContainer}>
                            {
                                this.state.init
                                    ? GoalManager.getGoalList().map(goal => {
                                        let goalId = goal.getId();
                                        let count = this.state.report.success.countByGoalId[goalId];

                                        return (
                                            <View key={this.key++} style={styles.goalSuccessIconGroup}>
                                                <Image style={styles.goalIcon} source={{ uri: goal.getIcon() }} />
                                                <Text style={styles.goalPercent}>{goal.getName()}</Text>
                                                <Text style={styles.goalCount}>{count}일</Text>
                                            </View>
                                        );
                                    })
                                    : null
                            }
                        </View>
                    </View>

                    {/* 선택한 목표 중 성공한 목표 */}
                    <Text style={styles.subTitle}>선택한 목표 중 성공한 목표 </Text>
                    <View style={[styles.graphContainer, styles.goalSelectContainer]}>
                        {/* 글자 쓸 공간 */}
                        <View style={{ width: 30 }}></View>

                        <View style={styles.goalSelectContentContainer}>
                            <View style={styles.goalSelectGrahpAndLineContainer}>

                                {/* 보조선 - 시작 */}
                                <View style={{
                                    ...styles.grahpSubLine,
                                    bottom: `${this.state.init
                                        ? this.state.report.select.maxCount % 2 == 0
                                            ? 100
                                            : (this.state.report.select.maxCount - 1) / this.state.report.select.maxCount * 100
                                        : 0}%`
                                }}>
                                    <Text style={styles.grahpSubLineCaption}>
                                        {this.state.init
                                            ? this.state.report.select.maxCount % 2 == 0
                                                ? this.state.report.select.maxCount
                                                : this.state.report.select.maxCount - 1
                                            : 0}일
                                    </Text>
                                </View>

                                <View style={{
                                    ...styles.grahpSubLine,
                                    bottom: `${this.state.init
                                        ? this.state.report.select.maxCount % 2 == 0
                                            ? 50
                                            : (this.state.report.select.maxCount - 1) / 2 / this.state.report.select.maxCount * 100
                                        : 0}%`
                                }}>
                                    <Text style={styles.grahpSubLineCaption}>
                                        {this.state.init
                                            ? this.state.report.select.maxCount % 2 == 0
                                                ? this.state.report.select.maxCount / 2
                                                : (this.state.report.select.maxCount - 1) / 2
                                            : 0}일
                                    </Text>
                                </View>

                                <View style={{ ...styles.grahpSubLine, bottom: 0 }}></View>
                                {/* 보조선 - 끝 */}

                                {/* 그래프 */}
                                <View style={styles.goalSelectGrahpContainer}>
                                    {
                                        this.state.init
                                            ? GoalManager.getGoalList().map(goal => {
                                                let goalId = goal.getId();
                                                let successCount = this.state.report.success.countByGoalId[goalId];
                                                let selectCount = this.state.report.select.countByGoalId[goalId];
                                                let maximum = this.state.report.select.maxCount;
                                                let border = 10;
                                                return (
                                                    <View key={this.key++} style={styles.goalSelectGrahpGroup}>
                                                        <View style={{
                                                            ...styles.goalSelectGrahpElement,
                                                            height: `${selectCount / maximum * 100}%`,
                                                            borderTopRightRadius: border,
                                                            borderTopLeftRadius: border,
                                                            backgroundColor: goal.getSubColor()
                                                        }}></View>
                                                        <View style={{
                                                            ...styles.goalSelectGrahpElement,
                                                            height: `${successCount / maximum * 100}%`,
                                                            borderTopRightRadius: successCount == selectCount ? border : 0,
                                                            borderTopLeftRadius: successCount == selectCount ? border : 0,
                                                            backgroundColor: goal.getMainColor()
                                                        }}></View>
                                                    </View>

                                                );
                                            })
                                            : null
                                    }
                                </View>
                            </View>

                            <View style={styles.goalSelectIconContainer}>
                                {
                                    this.state.init
                                        ? GoalManager.getGoalList().map(goal => {
                                            let goalId = goal.getId();
                                            let successCount = this.state.report.success.countByGoalId[goalId];
                                            let selectCount = this.state.report.select.countByGoalId[goalId];
                                            return (
                                                <View key={this.key++} style={styles.goalSelectIconGroup}>
                                                    <Image style={styles.goalIcon} source={{ uri: goal.getIcon() }} />
                                                    <Text style={styles.goalCount}>{successCount}/{selectCount}일</Text>
                                                </View>
                                            );
                                        })
                                        : null
                                }
                            </View>
                        </View>
                    </View>
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
        marginLeft: "auto",
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

    // 스크롤 뷰
    mainScrollView: {
        backgroundColor: Colors.background
    },
    mainScrollViewContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30
    },

    // 서브 제목
    subTitle: {
        ...Styles.textStyle.subtitle01,
        marginBottom: 20
    },

    // 그래프
    graphContainer: {
        width: "100%",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        borderRadius: 10,
        marginBottom: 35,
        backgroundColor: Colors.white
    },

    // 공통
    goalIcon: {
        width: 25,
        height: 25,
        marginBottom: 4
    },
    goalPercent: {
        ...Styles.textStyle.body02
    },
    goalCount: {
        ...Styles.textStyle.caption,
        color: Colors.black04
    },

    // 성공한 목표
    goalSuccessContainer: {},
    goalSuccessGrahp: {
        flexDirection: "row",
        width: "100%",
        minHeight: 20,
        borderRadius: 10,
        marginBottom: 10,
        overflow: "hidden"
    },
    goalSuccessGrahpElement: {
        height: 30
    },
    goalSuccessIconContainer: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    goalSuccessIconGroup: {
        alignItems: "center"
    },

    // 선택한 목표 중 성공한 목표
    goalSelectContainer: {
        flexDirection: "row"
    },
    goalSelectContentContainer: {
        flexGrow: 1
    },

    // 그래프
    goalSelectGrahpAndLineContainer: {
        flex: 1,
        marginBottom: 10,
    },
    goalSelectGrahpContainer: {
        flex: 1,
        flexDirection: "row",
        height: 150,
        justifyContent: "space-around"
    },
    goalSelectGrahpGroup: {
        width: 25
    },
    goalSelectGrahpElement: {
        width: "100%",
        position: "absolute",
        bottom: 0
    },

    // 아이콘
    goalSelectIconContainer: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    goalSelectIconGroup: {
        alignItems: "center"
    },

    // 보조선
    grahpSubLine: {
        position: "absolute",
        width: "100%",
        height: 1,
        backgroundColor: Colors.gray01
    },
    grahpSubLineCaption: {
        position: "absolute",
        ...Styles.textStyle.caption,
        width: 100,
        top: -5,
        left: -110,
        textAlign: "right",
        color: Colors.black04,
    }
});

export default ReportScreen;