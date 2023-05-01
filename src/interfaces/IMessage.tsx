import { User } from "./IUser";

export interface IMessage {
    userId: string;
    toUserId?: string;
    channelId? : string;
    content: string;
    user?: User
}