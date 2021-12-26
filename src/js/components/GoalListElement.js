import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

class GoalListElement extends React.Component {
    /**
     * goal, selected, onPress
     * @param {object} props 
     */
    constructor(props) {
        console.log("GoalListElement.constructor: ", props);
        super(props);
        this.goal = props.goal;
        this.selected = props.selected;
        this.onPress = props.onPress;
    }

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={() => { this.onPress(this.goal) }}>
                <View style={styles.goalIcon}><Text>{this.goal.getIcon()}</Text></View>
                <View style={styles.goalContent}>
                    <Text style={styles.goalName}>{this.goal.getName()}</Text>
                    <Text style={styles.goalDescription}>{this.goal.getDescription()}</Text>
                </View>
                {this.selected === true ? <Text style={styles.goalSuccess}>selected</Text> : null}
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
    goalDescription: {},
    goalSuccess: {
        position: "absolute",
        top: 0,
        right: 0,
        margin: 15
    }
});

export default GoalListElement;