import { IMessage } from "./IMessage";

export interface IMessagesPayload {
    channelId: string,
    messages: IMessage[]
}


export interface IMessagePayload {
    channelId: string,
    message: IMessage
}