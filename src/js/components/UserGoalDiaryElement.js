import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";

class UserGoalDiaryElement extends React.Component {

    _maxCount = 200;

    constructor(props) {
        console.log("UserGoalDiaryElement.constructor: ", props);
        super(props);
        this.userGoal = props.userGoal;
        this.goal = props.goal;
        this.state = {
            text: (!this.userGoal.getDiary() || this.userGoal.getDiary().length === 0) ? "" : this.userGoal.getDiary()
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text>{this.goal.getIcon()}</Text>
                    <Text>{this.goal.getName()}</Text>
                </View>
                <TextInput
                    style={styles.diaryInput}
                    multiline
                    placeholder="일기를 입력해주세요."
                    maxLength={this._maxCount}
                    onChangeText={text => this.setState({ text })}
                    value={this.state.text} />
                <Text>{this.state.text.length}/{this._maxCount}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "green"
    },
    title: {
        flexDirection: "row",
        marginBottom: 10
    },
    diaryInput: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: "tomato"
    }
});

export default UserGoalDiaryElement;