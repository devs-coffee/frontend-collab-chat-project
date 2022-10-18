import { Fetcher } from "./fetcher";
import { OperationResult } from "../interfaces/IOperationResult";
import { Server } from "../interfaces/IServer";
import { User } from "../interfaces/IUser";
import { serverCreationForm } from "../interfaces/IServerCreationForm";
import { serverUpdateForm } from "../interfaces/IServerUpdateForm";

export class ServerService extends Fetcher {
    async getServers():Promise<OperationResult<Server[]>> {
        const response = await super.get<Server[]>(`/servers`);
        return response.data;
    }
    async createServer(values:serverCreationForm):Promise<OperationResult<Server>> {
        const response = await super.post<serverCreationForm, Server>(`/servers`, values);
        return response.data;
    }
    async updateServer(values:serverUpdateForm, serverId:string | undefined):Promise<OperationResult<Server>> {
        const response = await super.patch<serverUpdateForm, Server>(`/servers/${serverId}`, values);
        return response.data;
    }
    async deleteServer(id:string):Promise<OperationResult<boolean>> {
        const response = await super.delete<boolean>(`/servers/${id}`);
        return response.data;
    }
    async getServerUsers(id:string):Promise<OperationResult<User[]>> {
        const response = await super.get<User[]>(`/servers/${id}/users`);
        return response.data;
    }
}