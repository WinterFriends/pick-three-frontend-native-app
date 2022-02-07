import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import DoubleClick from "react-native-double-click-instagram";
import Colors from "../common/Colors";
import Styles from "../common/Styles";
class UserGoalListElement extends React.Component {
    constructor(props) {
        console.log(`UserGoalListElement.constructor: goalName="${props.goal.getName()}"`);
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
            props.onChangeUserGoalSuccess(this.userGoal);
            return { success: targetValue };
        });
    }

    checkUserGoalDiaryEmpty() {
        return this.userGoal.getDiary() == "" || !this.userGoal.getDiary();
    }

    render() {
        return (
            <DoubleClick icon doubleClick={this.onPress.bind(this)}>
                <View style={styles.container}>
                    <Image style={styles.goalIcon} source={{ uri: this.userGoal.getSuccess() ? this.goal.getActiveIcon() : this.goal.getInactiveIcon() }} />
                    <View style={styles.goalContent}>
                        <Text style={{ ...styles.goalName, marginTop: this.checkUserGoalDiaryEmpty() ? 0 : -4 }}>{this.goal.getName()}</Text>
                        {
                            this.checkUserGoalDiaryEmpty()
                                ? null
                                : <Text style={styles.goalDiary}>{this.userGoal.getDiary()}</Text>
                        }
                    </View>
                </View>
            </DoubleClick>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        marginBottom: 15,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: Colors.white
    },
    goalIcon: {
        width: 38,
        height: 38,
        marginRight: 20,
    },
    goalContent: {
        flex: 1,
        justifyContent: "center"
    },
    goalName: {
        ...Styles.textStyle.subtitle01
    },
    goalDiary: {
        ...Styles.textStyle.body02,
        marginTop: 9,
        marginBottom: 2
    },
});

export default UserGoalListElement;