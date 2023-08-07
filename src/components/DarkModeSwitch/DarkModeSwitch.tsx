import { ChangeEventHandler } from "react";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";

import "./DarkModeSwitch.scss";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * 
 * @param darkMode a boolean indicating whether the dark mode is on or off.
 * @param setDarkMode a function that sets the dark mode state.
 * @returns A switch that allows the user to toggle the dark mode.
 */
export function DarkModeSwitch({ darkMode, setDarkMode }: { darkMode: boolean, setDarkMode: SetState<boolean> }) {


    const toggleDarkMode: ChangeEventHandler<HTMLInputElement> = (e) => {
        setDarkMode(!darkMode);
    }

    return (
        <FormGroup id="darkmode-switch">
            <FormControlLabel control={<Switch onChange={toggleDarkMode} />} checked={darkMode} label="darkmode" />
        </FormGroup>
    )
}