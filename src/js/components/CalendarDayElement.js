import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../common/Colors";
import Styles from "../common/Styles";
import GoalManager from "../managers/GoalManager";
import DateUtils from "../utils/DateUtils";

class CalendarDayElement extends React.Component {
    key = 0;

    constructor(props) {
        super(props);
        console.log(`CalendarDayElement.constructor: date="${props.date}"`);

        let day = DateUtils.formattedStringToDate(props.date).getDate();
        this.state = {
            date: props.date,
            day,
            successGoalIdList: props.successGoalIdList
        };
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={Styles.activeOpacity} style={styles.calendarRowItem} onPress={() => { this.props.onPress(this.props.date) }}>
                <View style={[styles.calendarRowItemContainer, this.props.selected ? styles.selectedContainer : null]}>
                    <Text style={[
                        styles.dayText,
                        this.props.selected ? styles.selectedText : null,
                        this.props.today ? styles.todayText : null
                    ]}>
                        {this.state.day}
                    </Text>
                    <View style={styles.markContainer}>
                        {
                            this.state.successGoalIdList.map(
                                (goalId, index) =>
                                    <View
                                        key={this.key++}
                                        style={{
                                            ...styles.mark,
                                            backgroundColor: GoalManager.getGoalById(goalId).getMainColor(),
                                            marginRight: index < this.state.successGoalIdList.length - 1 ? 3 : 0
                                        }}></View>

                            )
                        }
                    </View>
                </View>
            </TouchableOpacity >
        );
    }

    static rootStyle() {
        return styles.calendarRowItem;
    }
}

const styles = StyleSheet.create({
    calendarRowItem: {
        flex: 1,
        textAlign: "center",
    },
    calendarRowItemContainer: {
        width: 36,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        paddingTop: 5,
        paddingHorizontal: 6,
        paddingBottom: 17,
    },
    dayText: {
        ...Styles.textStyle.number,
        marginBottom: 6
    },
    selectedContainer: {
        borderRadius: 10,
        backgroundColor: Colors.primary03
    },
    selectedText: {
        // fontFamily: "Pretendard-Medium"
    },
    todayText: {
        // fontFamily: "Pretendard-Medium",
        textDecorationLine: "underline"
    },
    markContainer: {
        height: 5,
        flexDirection: "row"
    },
    mark: {
        width: 5,
        height: 5,
        borderRadius: 100,
    }
});

export default CalendarDayElement;