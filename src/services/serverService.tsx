import { Fetcher } from "./fetcher";
import { OperationResult } from "../interfaces/IOperationResult";
import { Server } from "../interfaces/IServer";

export class ServerService extends Fetcher {
    async getServers():Promise<OperationResult<Server[]>> {
        const response = await super.get<Server[]>(`/servers`);
        return response.data;
    }
}