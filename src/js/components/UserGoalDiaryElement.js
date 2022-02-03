import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import Colors from "../common/Colors";
import Styles from "../common/Styles";

class UserGoalDiaryElement extends React.Component {

    _maxCount = 200;

    constructor(props) {
        console.log("UserGoalDiaryElement.constructor: ", props);
        super(props);
        this.userGoal = props.userGoal;
        this.goal = props.goal;
        this.state = {
            text: (!this.userGoal.getDiary() || this.userGoal.getDiary().length === 0) ? "" : this.userGoal.getDiary(),
            focus: false
        }
    }

    onFocus(value) {
        this.setState({ focus: value });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Image style={styles.goalIcon} source={{ uri: this.goal.getIcon() }} />
                    <Text style={styles.goalName}>{this.goal.getName()}</Text>
                </View>
                <TextInput
                    style={[styles.diaryInput, this.state.focus ? styles.focusDiaryInput : null]}
                    onFocus={this.onFocus.bind(this, true)}
                    onBlur={this.onFocus.bind(this, false)}
                    multiline
                    placeholder="내용을 입력해주세요."
                    maxLength={this._maxCount}
                    onChangeText={text => {
                        this.setState({ text });
                        this.userGoal.setDiary(text);
                    }}
                    value={this.state.text} />
                <Text style={[styles.diaryCount, this.state.focus ? styles.focusDiaryCount : null]}>{this.state.text.length}/{this._maxCount}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 13
    },
    title: {
        flexDirection: "row",
        marginBottom: 9
    },
    goalIcon: {
        width: 24,
        height: 24,
        marginRight: 10
    },
    goalName: {
        ...Styles.textStyle.subtitle02,
        marginTop: 3
    },
    diaryInput: {
        ...Styles.textStyle.body02,
        minHeight: 100,
        marginBottom: 3,
        padding: 17,
        color: Colors.black02,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.black05,
        textAlignVertical: "top"
    },
    focusDiaryInput: {
        borderColor: Colors.black02
    },
    diaryCount: {
        ...Styles.textStyle.caption,
        marginLeft: "auto",
        color: Colors.black05
    },
    focusDiaryCount: {
        color: Colors.black02,
    }
});

export default UserGoalDiaryElement;