import { OperationResult } from "../interfaces/IOperationResult";
import { profileUpdateForm } from "../interfaces/IProfileUpdateForm";
import { Fetcher } from "./fetcher";
import { ApiUserResponse } from "../interfaces/IApiUserResponse";

export class UserService extends Fetcher {
    async updateProfile(values:profileUpdateForm, id:string):Promise<OperationResult<ApiUserResponse>> {
        const response = await super.patch<profileUpdateForm, ApiUserResponse>(`/users/${id}`, values);
        return response.data;
    }
}