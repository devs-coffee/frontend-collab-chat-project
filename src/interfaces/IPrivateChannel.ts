import { User } from "./IUser";

export interface PrivateChannel {
    id: string,
    title: string,
    users: string[],
    hasNew: boolean
}