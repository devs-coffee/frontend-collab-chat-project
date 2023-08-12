import { Theme } from "./ITheme";

export interface Prefs {
    prefs?: {
        colorScheme: Theme;
    }  
    picture?: string
}

export interface User extends Prefs {
    id: string,
    pseudo: string,
}
