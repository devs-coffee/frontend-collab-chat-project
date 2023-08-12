import { Theme } from "./ITheme";

export interface Prefs {
    colorScheme: Theme | "LIGHT" | "DARK";
}

export interface User extends Prefs {
    id: string;
    pseudo: string;
    picture?: string;
}
