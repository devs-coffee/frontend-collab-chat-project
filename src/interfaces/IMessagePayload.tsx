import { IMessage } from "./IMessage";

export interface IMessagesPayload {
    channelId: string,
    messages: IMessage[]
}