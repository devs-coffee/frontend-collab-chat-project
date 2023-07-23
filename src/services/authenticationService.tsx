import { OperationResult } from "../interfaces/IOperationResult";
import { signupForm } from "../interfaces/ISignupForm";
import { User } from "../interfaces/IUser";
import { Fetcher } from "./fetcher";
import { ApiAuthResponse } from "../interfaces/IApiAuthResponse";
import { loginForm } from "../interfaces/ILoginForm";

export class AuthenticationService extends Fetcher {
    
    async getMe():Promise<OperationResult<User>> {
        const response = await super.get<User>('/auth/getMe');
        return response.data;
    }
    async login(values:loginForm):Promise<OperationResult<ApiAuthResponse>> {
        const response = await super.post<loginForm, ApiAuthResponse>('/auth/login', values);
        return response.data;
    }
    async signup(values:signupForm):Promise<OperationResult<ApiAuthResponse>> {
        const response = await super.post<signupForm, ApiAuthResponse>('/auth/signup', values);
        return response.data;
    }
}