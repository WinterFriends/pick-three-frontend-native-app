import { StatusBar as Bar } from 'react-native';
import React, { useState } from "react";

export default function StatusBar(props) {
    let style = "dark-content";

    if (props && props.style == "light")
        style = "light-content";
    else if (props && props.style == "dark")
        style = "dark-content";

    return (
        <Bar barStyle={style} backgroundColor={props && props.backgroundColor ? props.backgroundColor : "#FFFFFF"} />
    )
}