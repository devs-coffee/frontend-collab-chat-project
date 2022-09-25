import { OperationResult } from "../interfaces/IOperationResult";
import { User } from "../interfaces/IUser";
import { Fetcher } from "./fetcher";

export class AuthenticationService extends Fetcher {
    constructor() {
        super();
    }
    async getMe():Promise<OperationResult<User>> {
        const response = await super.get<User>('/auth/getMe');
        return response.data;
    }
}