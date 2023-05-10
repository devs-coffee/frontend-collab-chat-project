import { User } from "./IUser";

export interface IMessage {
    id?: string;
    userId: string;
    toUserId?: string;
    channelId? : string;
    content: string;
    user?: User;
    createdAt?: string;
}