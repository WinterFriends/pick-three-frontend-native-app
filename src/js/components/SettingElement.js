import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

class SettingElement extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
                <Text>{this.props.title}</Text>
                <Text> &gt;</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "tomato"
    }
});

export default SettingElement;