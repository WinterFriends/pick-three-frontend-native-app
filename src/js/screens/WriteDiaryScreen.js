import React from "react";
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Goal from "../common/Goal";
import UserGoal from "../common/UserGoal";
import UserGoalDiaryElement from "../components/UserGoalDiaryElement";

let userGoalList = [
    new UserGoal(
        '2021-12-22',
        new Goal(1, "일", "일 열심히!", "일 아이콘"),
        false,
        "열심히 일을 했다..?"
    ),
    new UserGoal(
        '2021-12-22',
        new Goal(2, "건강", "건강 열심히!", "건강 아이콘"),
        false,
        "열심히 건강을 했다..?"
    ),
    new UserGoal(
        '2021-12-22',
        new Goal(3, "가족", "가족 열심히!", "가족 아이콘"),
        false,
        "열심히 가족을 했다..?"
    ),
]

class WriteDiaryScreen extends React.Component {

    userGoalIndex = 0;

    constructor(props) {
        super(props);
        this.userGoalList = [...userGoalList];
    }

    onPressBackButton() {
        this.props.navigation.goBack(null);
    }

    onPressDeleteAllButton() {
        console.log("WriteDiaryScreen.onPressDeleteAllButton");
        let navigation = this.props.navigation;
        Alert.alert(
            "일기 삭제",
            "일기를 삭제하시겠습니까?",
            [
                {
                    text: "취소",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "확인", onPress: () => navigation.goBack(null)
                }
            ]
        )
    }

    onPressConfirm() {
        this.props.navigation.goBack(null);
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
                            return <UserGoalDiaryElement userGoal={userGoal} key={this.userGoalIndex++} />;
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