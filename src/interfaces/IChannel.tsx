import { Message } from "./IMessage";

export interface Channel {
    id: string,
    title: string,
    messages: Message[]
}