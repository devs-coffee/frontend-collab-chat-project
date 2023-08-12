import { OperationResult } from "../interfaces/IOperationResult";
import { profileUpdateForm } from "../interfaces/IProfileUpdateForm";
import { Fetcher } from "./fetcher";
import { User, Prefs } from "../interfaces/IUser";

export class UserService extends Fetcher {
    async updateProfile(values: profileUpdateForm, id: string): Promise<OperationResult<User>> {
        const response = await super.put<profileUpdateForm, User>(`/users/${id}`, values);
        return response.data;
    }

    async updatePrefs(values: Prefs): Promise<OperationResult<any>> {
        const response = await super.put<Prefs, User>('/users/prefs', values);
        return response.data;
    }

    async getUser(id: string): Promise<OperationResult<User>> {
        const response = await super.get<User>(`/users/${id}`);
        return response.data;
    }
}