import React from "react";
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Goal from "../common/Goal"
import GoalListElement from "../components/GoalListElement";
import StatusBar from "../components/StatusBar";
import GoalManager from "../managers/GoalManager";

class SelectGoalScreen extends React.Component {

    goalListIndex = 0;

    constructor(props) {
        console.log("SelectGoalScreen.constructor");
        super(props);

        this.goalList = GoalManager.getGoalList();
        this.state = {
            selectedGoalIdList: [0, 1, 2]
        };
    }

    onPressGoalListElement(goal) {
        console.log(`SelectGoalScreen.onPressGoalListElement: ${goal.getId()} (${goal.getName()})`);

        let index = this.state.selectedGoalIdList.indexOf(goal.getId());

        // 포함되어 있으면 삭제
        if (index > -1)
            this.setState(state => {
                let newList = [...state.selectedGoalIdList];
                newList.splice(index, 1);
                return { selectedGoalIdList: newList };
            });
        // 포함되어 있지 않고, 3개 이하면
        else if (this.state.selectedGoalIdList.length < 3)
            this.setState(state => ({ selectedGoalIdList: [...state.selectedGoalIdList, goal.getId()] }));
    }

    onPressConfirm() {
        if (this.state.selectedGoalIdList.length === 3)
            this.props.navigation.goBack(null);
    }

    render() {
        return (
            <View style={styles.container}>
                <Button title="back" style={styles.backButton} onPress={() => { this.props.navigation.goBack(null) }} />

                <ScrollView style={styles.goalList} contentContainerStyle={{ padding: 30 }}>
                    {
                        this.goalList.map(goal => {
                            return <GoalListElement
                                goal={goal}
                                selected={this.state.selectedGoalIdList.indexOf(goal.getId()) > -1 ? true : false}
                                key={this.goalListIndex++}
                                onPress={this.onPressGoalListElement.bind(this)} />;
                        })
                    }
                </ScrollView>

                <TouchableOpacity style={styles.confirmButton} onPress={this.onPressConfirm.bind(this)}>
                    <Text>{this.state.selectedGoalIdList.length}개 선택 완료</Text>
                </TouchableOpacity>

                <StatusBar />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    backButton: {
        right: 1
    },
    goalList: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: "orange"
    },
    confirmButton: {
        width: "100%",
        paddingVertical: 20,
        alignItems: "center",
        backgroundColor: "yellow"
    }
});

export default SelectGoalScreen;