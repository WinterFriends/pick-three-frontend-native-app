import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

const goal = [
    {
        name: "a",
        ratio: 10,
        select: 20,
        success: 10,
        color: "black",
        first: true
    },
    {
        name: "b",
        ratio: 20,
        select: 20,
        success: 10,
        color: "tomato"
    },
    {
        name: "c",
        ratio: 30,
        select: 20,
        success: 10,
        color: "yellow"
    },
    {
        name: "d",
        ratio: 20,
        select: 20,
        success: 10,
        color: "blue"
    },
    {
        name: "e",
        ratio: 20,
        select: 20,
        success: 10,
        color: "teal",
        last: true
    }
]

class ReportScreen extends React.Component {
    key = 0;

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topArea}>
                    <View style={styles.topbar}>
                        <Text style={styles.title}>ReportScreen</Text>
                        <TouchableOpacity style={styles.changeUnitButton}><Text>Change Unit</Text></TouchableOpacity>
                    </View>
                    <Text>12월 2째 주</Text>
                </View>

                <ScrollView style={styles.content}>
                    <Text>성공한 목표</Text>
                    <View style={styles.goalSuccessContainer}>
                        <View style={styles.goalSuccessGrahp}>
                            {
                                goal.map(value => {
                                    console.log(value)
                                    let border = 5;
                                    return (
                                        <View key={this.key++} style={{
                                            ...styles.goalSuccessGrahpElement,
                                            backgroundColor: value["color"],
                                            width: `${value["ratio"]}%`,
                                            borderTopLeftRadius: value["first"] ? border : 0,
                                            borderBottomLeftRadius: value["first"] ? border : 0,
                                            borderTopRightRadius: value["last"] ? border : 0,
                                            borderBottomRightRadius: value["last"] ? border : 0,
                                        }}></View>
                                    );
                                })
                            }
                        </View>

                        <View style={styles.goalSuccessIconContainer}>
                            {
                                goal.map(value => {
                                    return (
                                        <View key={this.key++} style={styles.goalSuccessIconGroup}>
                                            <Text>아이콘</Text>
                                            <Text>{value["name"]}</Text>
                                            <Text>{value["success"]}일</Text>
                                        </View>
                                    );
                                })
                            }
                        </View>
                    </View>

                    <Text>선택한 목표</Text>
                    <View style={styles.goalSelectContainer}>
                        {
                            goal.map(value => {
                                let maximum = 20;
                                return (
                                    <View key={this.key++} style={styles.goalSelectGroup}>
                                        <View style={styles.goalSelectGrahpGroup}>
                                            <View style={{
                                                width: 20,
                                                bottom: 0,
                                                height: `${value["select"] / maximum * 100}%`,
                                                backgroundColor: "grey",
                                                borderTopRightRadius: 5,
                                                borderTopLeftRadius: 5,
                                            }}></View>
                                            <View style={{
                                                position: "absolute",
                                                width: 20,
                                                bottom: 0,
                                                height: `${value["success"] / maximum * 100}%`,
                                                backgroundColor: value["color"]
                                            }}></View>
                                        </View>
                                        <Text>아이콘</Text>
                                    </View>
                                );
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    topArea: {
        width: "100%",
    },
    topbar: {
        width: "100%",
        alignItems: "center"
    },
    title: {
        textAlign: "center"
    },
    changeUnitButton: {
        position: "absolute",
        right: 0,
        top: "50%",
        width: 70,
        backgroundColor: "tomato"
    },

    content: {
        width: "100%",
        height: "100%"
    },

    /* GoalSuccess */
    goalSuccessContainer: {
        width: "100%",
        padding: 10,
        backgroundColor: "grey"
    },
    goalSuccessGrahp: {
        flexDirection: "row",
        width: "100%",
        minHeight: 20,
        borderRadius: 10,
        marginBottom: 10
    },
    goalSuccessGrahpElement: {
        height: "100%"
    },
    goalSuccessIconContainer: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    goalSuccessIconGroup: {
        alignItems: "center"
    },

    /* GoalSelect */
    goalSelectContainer: {
        flexDirection: "row",
        width: "100%",
        padding: 10,
        backgroundColor: "red",
        justifyContent: "space-around"
    },
    goalSelectGroup: {
        alignItems: "center"
    },
    goalSelectGrahpGroup: {
        height: 200,
        marginBottom: 10
    },
});

export default ReportScreen;