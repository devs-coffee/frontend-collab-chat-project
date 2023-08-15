import { OperationResult } from "../interfaces/IOperationResult";
import { profileUpdateForm } from "../interfaces/IProfileUpdateForm";
import { Fetcher } from "./fetcher";
import { User } from "../interfaces/IUser";
import { PrefsUpdate } from "../interfaces/IPrefsUpdate";

export class UserService extends Fetcher {
    async updateProfile(values: profileUpdateForm, id: string): Promise<OperationResult<User>> {
        const response = await super.put<profileUpdateForm, User>(`/users/${id}`, values);
        return response.data;
    }

    async updatePrefs(values: PrefsUpdate): Promise<OperationResult<PrefsUpdate>> {
        const requestValues = { colorScheme: values.colorScheme.toUpperCase() } ;
        let response = await super.put<PrefsUpdate, PrefsUpdate>('/users/prefs', requestValues);
        response.data.result.colorScheme = response.data.result!.colorScheme.toLowerCase();
        return response.data;
    }

    async getUser(id: string): Promise<OperationResult<User>> {
        const response = await super.get<User>(`/users/${id}`);
        return response.data;
    }
}