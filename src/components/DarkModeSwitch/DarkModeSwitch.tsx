import { ChangeEventHandler, useState } from "react";

import {FormControlLabel, FormGroup, Switch} from "@mui/material";

import "./DarkModeSwitch.scss";

export default function DarkModeSwitch() {
    const [ checked, setChecked ] = useState<boolean>(document.documentElement.getAttribute("data-theme") === "dark");

    const setDark = () => {
        localStorage.setItem("theme", "dark");
        document.documentElement.setAttribute("data-theme", "dark");
    }
    
    const setLight = () => {
        localStorage.setItem("theme", "light");
        document.documentElement.setAttribute("data-theme", "light");
    }
    
    const storedTheme = localStorage.getItem("theme");

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    const defaultDark = storedTheme === "dark" || (storedTheme === null && prefersDark);


    if(defaultDark) {
        localStorage.setItem("theme", "dark");
        document.documentElement.setAttribute("data-theme", "dark");
    }

    const toggleDarkMode: ChangeEventHandler<HTMLInputElement> = (e) => {
        
        e.target.checked ? setDark() : setLight();
        setChecked(!checked);
    }

    return (
        <FormGroup id="darkmode-switch">
            <FormControlLabel control={<Switch onChange={toggleDarkMode}/>} checked={checked} label="darkmode" />
        </FormGroup>
    )
}