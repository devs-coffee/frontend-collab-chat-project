import { Theme } from "./Theme.enum";

export interface Prefs {
    prefs?: {
        colorScheme: Theme;
    }
}

export interface User extends Prefs {
    id: string;
    pseudo: string;
    picture?: string;
}
