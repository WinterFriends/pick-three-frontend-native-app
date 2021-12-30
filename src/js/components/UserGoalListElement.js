import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

class UserGoalListElement extends React.Component {
    constructor(props) {
        console.log("UserGoalListElement.constructor: ", props);
        super(props);
        this.userGoal = props.userGoal;
        this.goal = props.goal;
        this.state = {
            success: this.userGoal.getSuccess()
        }
    }

    onPress() {
        console.log("UserGoalListElement.onPress");
        this.setState((state, props) => {
            let targetValue = !state.success;
            this.userGoal.setSuccess(targetValue);
            props.changeUserGoalSuccess(this.userGoal);
            return { success: targetValue };
        });
    }

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={this.onPress.bind(this)}>
                <View style={styles.goalIcon}><Text>{this.goal.getIcon()}</Text></View>
                <View style={styles.goalContent}>
                    <Text style={styles.goalName}>{this.goal.getName()}</Text>
                    <Text style={styles.goalDiary}>{this.userGoal.getDiary()}</Text>
                </View>
                <Text style={styles.goalSuccess}>{this.userGoal.getSuccess() ? "S" : "F"}</Text>
            </TouchableOpacity >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        padding: 15,
        backgroundColor: "tomato",
        borderColor: "red",
        borderWidth: 2,
        borderRadius: 10,
    },
    goalIcon: {
        marginRight: 15
    },
    goalContent: {},
    goalName: {},
    goalDiary: {},
    goalSuccess: {
        position: "absolute",
        top: 0,
        right: 0,
        margin: 15
    }
});

export default UserGoalListElement;