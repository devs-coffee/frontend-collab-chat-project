import { User } from "./IUser";

export interface PrivateChannel {
    id: string,
    users: Array<{user:User}>
}