import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Colors from "../common/Colors";
import Styles from "../common/Styles";
import DateUtils from "../utils/DateUtils";

const goal = [
    {
        name: "a",
        ratio: 10,
        select: 20,
        success: 10,
        color: "black",
        first: true
    },
    {
        name: "b",
        ratio: 20,
        select: 20,
        success: 10,
        color: "tomato"
    },
    {
        name: "c",
        ratio: 30,
        select: 20,
        success: 10,
        color: "yellow"
    },
    {
        name: "d",
        ratio: 20,
        select: 20,
        success: 10,
        color: "blue"
    },
    {
        name: "e",
        ratio: 20,
        select: 20,
        success: 10,
        color: "teal",
        last: true
    }
]

class ReportScreen extends React.Component {
    key = 0;

    constructor(props) {
        super(props);

        let currentDate = new Date();
        let currentDateString = DateUtils.dateToFormattedString(currentDate);

        this.state = {
            init: false,
            targetYear: currentDate.getFullYear(),
            targetMonth: currentDate.getMonth() + 1,
            targetWeek: 0,
            targetDateString: currentDateString,
            userGoalListByDate: {},
        };
    }

    /**
         * 월 선택기의 버튼(좌, 우)를 눌렀을 때 호출되는 함수
         * @param {number}} dir 
         */
    onPressMonthSelectorButton(dir) {
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
                            style={styles.button}>
                            <Image title="Select Goal" source={require("../../img/month_btn.png")} style={styles.buttonImage} />
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

                    <Text style={styles.currentMonth}>{this.state.targetYear}년 {this.state.targetMonth}월</Text>

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
                                goal.map(value => {
                                    let border = 10;
                                    return (
                                        <View key={this.key++} style={{
                                            ...styles.goalSuccessGrahpElement,
                                            width: `${value["ratio"]}%`,
                                            borderTopLeftRadius: value["first"] ? border : 0,
                                            borderBottomLeftRadius: value["first"] ? border : 0,
                                            borderTopRightRadius: value["last"] ? border : 0,
                                            borderBottomRightRadius: value["last"] ? border : 0,
                                            backgroundColor: value["color"],
                                        }}></View>
                                    );
                                })
                            }
                        </View>

                        <View style={styles.goalSuccessIconContainer}>
                            {
                                goal.map(value => {
                                    return (
                                        <View key={this.key++} style={styles.goalSuccessIconGroup}>
                                            <Image style={styles.goalIcon} />
                                            <Text style={styles.goalPercent}>{value["name"]}</Text>
                                            <Text style={styles.goalCount}>{value["success"]}일</Text>
                                        </View>
                                    );
                                })
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

                                {/* 보조선 */}
                                <View style={{ ...styles.grahpSubLine, bottom: "100%" }}>
                                    <Text style={styles.grahpSubLineCaption}>{10}일</Text>
                                </View>

                                <View style={{ ...styles.grahpSubLine, bottom: "50%" }}>
                                    <Text style={styles.grahpSubLineCaption}>{10}일</Text>
                                </View>

                                <View style={{ ...styles.grahpSubLine, bottom: 0 }}></View>

                                {/* 그래프 */}
                                <View style={styles.goalSelectGrahpContainer}>
                                    {
                                        goal.map(value => {
                                            let border = 10;
                                            let maximum = 20;
                                            return (
                                                <View key={this.key++} style={styles.goalSelectGrahpGroup}>
                                                    <View style={{
                                                        ...styles.goalSelectGrahpElement,
                                                        height: `${value["select"] / maximum * 100}%`,
                                                        borderTopRightRadius: border,
                                                        borderTopLeftRadius: border,
                                                        backgroundColor: "grey",
                                                    }}></View>
                                                    <View style={{
                                                        ...styles.goalSelectGrahpElement,
                                                        height: `${value["success"] / maximum * 100}%`,
                                                        position: "absolute",
                                                        backgroundColor: value["color"]
                                                    }}></View>
                                                </View>

                                            );
                                        })
                                    }
                                </View>
                            </View>

                            <View style={styles.goalSelectIconContainer}>
                                {
                                    goal.map(value => {
                                        return (
                                            <View key={this.key++} style={styles.goalSelectIconGroup}>
                                                <Image style={styles.goalIcon} />
                                                <Text style={styles.goalCount}>일</Text>
                                            </View>
                                        );
                                    })
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
        marginBottom: 4,
        //test
        backgroundColor: "teal",
        borderRadius: 100
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
        marginBottom: 10
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
        marginBottom: 10,
    },
    goalSelectGrahpContainer: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    goalSelectGrahpGroup: {
        height: 150,
    },
    goalSelectGrahpElement: {
        width: 25,
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