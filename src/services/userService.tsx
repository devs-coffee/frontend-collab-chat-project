import { OperationResult } from "../interfaces/IOperationResult";
import { profileUpdateForm } from "../interfaces/IProfileUpdateForm";
import { User } from "../interfaces/IUser";
import { Fetcher } from "./fetcher";
import { ApiUserResponse } from "../interfaces/IApiUserResponse";
import { useSelector } from 'react-redux';

export class UserService extends Fetcher {
    constructor() {
        super()
    }
    private authStatus = useSelector((state:any) => state.auth);
    async updateProfile(values:profileUpdateForm):Promise<OperationResult<ApiUserResponse>> {
        const response = await super.patch<profileUpdateForm, ApiUserResponse>(`/user/${this.authStatus.user.id}`, values);
        return response.data;
    }
}