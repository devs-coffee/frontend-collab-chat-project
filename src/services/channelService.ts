import { Fetcher } from "./fetcher";
import { OperationResult } from "../interfaces/IOperationResult";
import { ChannelUpdateValues } from "../interfaces/IChannelUpdateValues";
import { ChannelBase, ChannelCreationValues } from "../interfaces/IChannel.base";
import { PrivateChannel } from "../interfaces/IPrivateChannel";

export class ChannelService extends Fetcher {
    async updateChannel(values: ChannelUpdateValues):Promise<OperationResult<ChannelBase>> {
        const response = await super.put<ChannelUpdateValues, ChannelBase>(`/channels/${values.id}`, values);
        return response.data;
    }

    async createChannel(values: ChannelCreationValues): Promise<OperationResult<ChannelBase>> {
        const response = await super.post<ChannelCreationValues, ChannelBase>(`/channels`, values);
        return response.data;
    }

    async deleteChannel(id:string): Promise<OperationResult<boolean>> {
        const response = await super.delete<boolean>(`/channels/${id}`);
        return response.data;
    }

    async markAsRead(id:string): Promise<OperationResult<boolean>> {
        const response = await super.put<string, boolean>((`/channels/${id}/isRead`));
        return response.data;
    }

    async getPrivateChannels(): Promise<OperationResult<PrivateChannel[]>> {
        const response = await super.get<any>(`/channels/@me`);
        return response.data;
    }
}