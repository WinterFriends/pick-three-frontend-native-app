import React from "react";
import { View, Text, StyleSheet } from "react-native";

class CalendarScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>CalendarScreen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default CalendarScreen;