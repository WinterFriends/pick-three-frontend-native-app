import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>HomeScreen</Text>
                <Button title="Go WriteDiaryScreen" onPress={() => { this.props.navigation.navigate("WriteDiaryScreen") }} />
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

export default HomeScreen;