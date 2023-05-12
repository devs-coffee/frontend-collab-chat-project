import { Fetcher } from "./fetcher";
import { OperationResult } from "../interfaces/IOperationResult";
import { IMessage } from "../interfaces/IMessage";

export class MessageService extends Fetcher {
    async send(values: IMessage):Promise<OperationResult<IMessage>> {
        const response = await super.post<IMessage, IMessage>(`/messages`, values);
        return response.data;
    }

    async getMessagesByChannelId(channelId: string):Promise<OperationResult<IMessage[]>> {
        const response = await super.get<IMessage[]>(`/messages/${channelId}`);
        return response.data;
    }

    async update(messageId: string, content: string):Promise<OperationResult<IMessage>> {
        const response = await super.put<string, IMessage>(`/messages/${messageId}`, content);
        return response.data;
    }

    async remove(messageId: string):Promise<OperationResult<IMessage[]>> {
        const response = await super.delete<IMessage[]>(`/messages/${messageId}`);
        return response.data;
    }
}