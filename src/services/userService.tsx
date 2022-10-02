import { OperationResult } from "../interfaces/IOperationResult";
import { profileUpdateForm } from "../interfaces/IProfileUpdateForm";
import { User } from "../interfaces/IUser";
import { Fetcher } from "./fetcher";
import { ApiUserResponse } from "../interfaces/IApiUserResponse";
import { useSelector } from 'react-redux';

export class UserService extends Fetcher {
    // constructor() {
    //     super()
    // }
    //super()
    //private authStatus = useSelector((state:any) => state.auth);
    async updateProfile(values:profileUpdateForm, id:string):Promise<OperationResult<ApiUserResponse>> {
        const response = await super.patch<profileUpdateForm, ApiUserResponse>(`/users/${id}`, values);
        return response.data;
    }
}