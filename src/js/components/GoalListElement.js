import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Colors from "../common/Colors";
import Styles from "../common/Styles";

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
            <TouchableOpacity
                style={[styles.container, this.selected ? styles.selectedContainer : null]}
                activeOpacity={Styles.activeOpacity}
                onPress={() => { this.onPress(this.goal) }}>
                <Image style={styles.goalIcon} source={{ uri: this.goal.getIcon() }} />
                <View style={styles.goalContent}>
                    <Text style={styles.goalName}>{this.goal.getName()}</Text>
                    <Text style={styles.goalDescription}>{this.goal.getDescription()}</Text>
                </View>
                {this.selected === true ? <Image style={styles.goalSuccess} source={require("../../img/yellow_check_mark.png")} /> : null}
            </TouchableOpacity >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        marginTop: 1,
        marginBottom: 10,
        paddingBottom: 20,
        paddingHorizontal: 15,
        borderColor: Colors.gray02,
        borderWidth: 1,
        borderRadius: 8
    },
    selectedContainer: {
        borderColor: Colors.primary01,
        borderWidth: 2,
        marginTop: 0,
        marginBottom: 9,
        paddingHorizontal: 14,
    },
    goalIcon: {
        width: 25,
        height: 25,
        marginTop: 15,
        marginRight: 9
    },
    goalContent: {
        flex: 1
    },
    goalName: {
        ...Styles.textStyle.subtitle02,
        marginTop: 19,
        marginBottom: 11
    },
    goalDescription: {
        ...Styles.textStyle.body03,
        flex: 1,
        color: Colors.black02
    },
    goalSuccess: {
        position: "absolute",
        width: 17,
        height: 17,
        top: 0,
        right: 0,
        margin: 16
    }
});

export default GoalListElement;