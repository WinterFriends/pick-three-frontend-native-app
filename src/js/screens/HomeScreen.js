import React, { useEffect } from "react";
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import DateUtils from "../utils/DateUtils";
import Goal from "../common/Goal";
import UserGoal from "../common/UserGoal";
import UserGoalListElement from "../components/UserGoalListElement";
import StatusBar from "../components/StatusBar.js"
import GoalManager from "../managers/GoalManager";

let userGoalList = [
    new UserGoal(
        '2021-12-22',
        1,
        false,
        "열심히 일을 했다..?"
    ),
    new UserGoal(
        '2021-12-22',
        2,
        false,
        "열심히 건강을 했다..?"
    ),
    new UserGoal(
        '2021-12-22',
        3,
        false,
        "열심히 가족을 했다..?"
    ),
]

class HomeScreen extends React.Component {
    userGoalListIndex = 0;

    constructor(props) {
        super(props);
        this.state = {
            userGoalList: userGoalList
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            console.log("HomeScreen.onFocus");
        });
    }

    changeDate(date) {
        console.log(`MainPage.ChangeDate: ${date}`);
        this.setState({
            userGoalList: [
                new UserGoal(
                    '2021-12-22',
                    1,
                    false,
                    "열심히 일을 했다..?"
                ),
                new UserGoal(
                    '2021-12-22',
                    2,
                    false,
                    "열심히 건강을 했다..?"
                ),
                new UserGoal(
                    '2021-12-22',
                    3,
                    false,
                    "열심히 가족을 했다..?"
                ),
            ]
        });
    }

    changeUserGoalSuccess(userGoal) {
        let goal = GoalManager.getGoalById(userGoal.getGoalId());
        console.log(`MainPage.ChangeUserGoalSuccess: ${userGoal.getSuccess()} (${goal.getName()})`);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.buttons}>
                    <Button title="Write Diary"
                        style={styles.button}
                        onPress={() => {
                            this.props.navigation.navigate("WriteDiaryScreen");
                        }}
                    />
                    <Button
                        title="Select Goal"
                        style={styles.button}
                        onPress={() => {
                            this.props.navigation.navigate("SelectGoalScreen");
                        }} />
                </View>

                <TouchableOpacity onPress={this.changeDate.bind(this, DateUtils.dateToFormattedString(new Date()))}>
                    <Text style={styles.calendar}>{DateUtils.dateToFormattedString(new Date())}</Text>
                </TouchableOpacity>

                <ScrollView style={styles.userGoalList} contentContainerStyle={{ padding: 30 }}>
                    {
                        this.state.userGoalList.map((userGoal, i) =>
                            <UserGoalListElement
                                key={this.userGoalListIndex++}
                                userGoal={userGoal}
                                goal={GoalManager.getGoalById(userGoal.getGoalId())}
                                changeUserGoalSuccess={this.changeUserGoalSuccess.bind(this)}
                            />
                        )
                    }
                </ScrollView>
                <StatusBar />
            </View>
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        height: "100%"
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 30
    },
    button: {
        width: "auto"
    },
    calendar: {
        textAlign: "center",
        marginBottom: 70
    },
    userGoalList: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: "orange"
    }
})

export default HomeScreen;