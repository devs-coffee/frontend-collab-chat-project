import { Fetcher } from "./fetcher";
import { OperationResult } from "../interfaces/IOperationResult";
import { ChannelUpdateValues } from "../interfaces/IChannelUpdateValues";
import { ChannelCreationValues } from "../interfaces/IChannel.base";

export class ChannelService extends Fetcher {
    async updateChannel(values: ChannelUpdateValues):Promise<OperationResult<any>> {
        const response = await super.put<ChannelUpdateValues, any>(`/channels/${values.id}`);
        return response.data;
    }

    async createChannel(values: ChannelCreationValues): Promise<OperationResult<any>> {
        const response = await super.post<ChannelCreationValues, any>(`/channels`, values);
        return response.data;
    }

    async deleteChannel(id:string): Promise<OperationResult<boolean>> {
        const response = await super.delete<boolean>(`/channels/${id}`);
        return response.data;
    }
}