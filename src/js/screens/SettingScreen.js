import React from "react";
import { View, Text, StyleSheet } from "react-native";

class SettingScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>SettingScreen</Text>
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

export default SettingScreen;