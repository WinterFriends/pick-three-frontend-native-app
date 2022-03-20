import { StatusBar as Bar } from 'react-native';
import React, { useState } from "react";

export default function StatusBar(props) {
    let style = "light-content";

    if (props && props.style)
        style = "dark-content";

    return (
        <Bar barStyle={style} />
    )
}