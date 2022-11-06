import { User } from "./IUser";

export interface Message {
    id: string,
    content: string,
    user: User
}