import { Fetcher } from "./fetcher";
import { OperationResult } from "../interfaces/IOperationResult";
import { IMessage } from "../interfaces/IMessage";
import { channel } from "diagnostics_channel";

export class MessageService extends Fetcher {
    async send(values: IMessage):Promise<OperationResult<IMessage>> {
        const response = await super.post<IMessage, IMessage>(`/messages`, values);
        return response.data;
    }

    async getMessagesByChannelId(channelId: string):Promise<OperationResult<IMessage[]>> {
        const response = await super.get<IMessage[]>(`/messages/${channelId}`);
        return response.data;
    }
}