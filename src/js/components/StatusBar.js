import { StatusBar as Bar } from "expo-status-bar";
import { useState } from "react";

export default function StatusBar(props) {
    let style = "dark";

    if (props && props.style)
        style = "light";

    return (
        <Bar style={style} />
    )
}