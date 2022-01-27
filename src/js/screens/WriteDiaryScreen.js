import React from "react";
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Goal from "../common/Goal";
import UserGoal from "../common/UserGoal";
import UserGoalDiaryElement from "../components/UserGoalDiaryElement";
import ApiManager from "../managers/ApiManager";
import GoalManager from "../managers/GoalManager";
import DateUtils from "../utils/DateUtils";

class WriteDiaryScreen extends React.Component {

    userGoalIndex = 0;

    constructor(props) {
        super(props);

        let dateString = props.route.params.date;
        let date = DateUtils.formattedStringToDate(dateString);

        this.state = {
            dateString: dateString,
            date: date
        }
        this.userGoalList = props.route.params.userGoalList;
    }

    onPressBackButton() {
        this.props.navigation.goBack(null);
    }

    onPressConfirmButton() {
        ApiManager.setUserGoalDetailByDate(this.props.route.params.date, this.userGoalList, ["diary"])
            .then(status => this.props.navigation.goBack(null));
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.buttons}>
                    <Button title="back" onPress={this.onPressBackButton.bind(this)} />
                    <Button title="delete all" onPress={this.onPressDeleteAllButton.bind(this)} />
                </View>

                <View style={styles.title}>
                    <Text>Today's Diary</Text>
                    <Text>오늘의 일기를 작성해주세요.</Text>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={{ padding: 20 }}>
                    {
                        this.userGoalList.map(userGoal => {
                            return <UserGoalDiaryElement
                                key={this.userGoalIndex++}
                                userGoal={userGoal}
                                goal={GoalManager.getGoalById(userGoal.getGoalId())}
                            />;
                        })
                    }
                </ScrollView>

                <TouchableOpacity style={styles.confirmButton} onPress={this.onPressConfirm.bind(this)}>
                    <Text>저장</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 30
    },
    title: {
        alignItems: "center"
    },
    scrollView: {
        width: "100%",
        backgroundColor: "teal"
    },
    confirmButton: {
        width: "100%",
        paddingVertical: 20,
        alignItems: "center",
        backgroundColor: "yellow"
    }
});

export default WriteDiaryScreen;