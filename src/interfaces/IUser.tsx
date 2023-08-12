import { Theme } from "./ITheme";

export interface User {
    id: string;
    pseudo: string;
    picture?: string;
    prefs?: {
        colorScheme: Theme | "LIGHT" | "DARK";
    }
}
