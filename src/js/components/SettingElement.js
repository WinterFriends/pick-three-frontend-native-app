import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Styles from "../common/Styles"

class SettingElement extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity style={styles.container} activeOpacity={Styles.activeOpacity} onPress={this.props.onPress}>
                <Text style={styles.title}>{this.props.title}</Text>
                <Image style={styles.button} source={require("../../img/right_arrow.png")} />
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
        paddingHorizontal: 27
    },
    title: {
        ...Styles.textStyle.body01
    },
    button: {
        width: 24,
        height: 24,
        marginVertical: 17
    }
});

export default SettingElement;