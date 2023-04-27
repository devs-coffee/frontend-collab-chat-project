import { Fetcher } from "./fetcher";
import { OperationResult } from "../interfaces/IOperationResult";
import { ChannelUpdateValues } from "../interfaces/IChannelUpdateValues";

export class ChannelService extends Fetcher {
    async updateChannel(values: ChannelUpdateValues):Promise<OperationResult<any>> {
        const response = await super.put<ChannelUpdateValues, any>(`/channels/${values.id}`);
        return response.data;
    }
}