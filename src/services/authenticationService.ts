import { OperationResult } from "../interfaces/IOperationResult";
import { signupForm } from "../interfaces/ISignupForm";
import { User } from "../interfaces/IUser";
import { Fetcher } from "./fetcher";
import { ApiAuthResponse } from "../interfaces/IApiAuthResponse";
import { loginForm } from "../interfaces/ILoginForm";
import { Theme } from "../interfaces/Theme.enum";
import Cookies from "js-cookie";

export class AuthenticationService extends Fetcher {
    
    async getMe():Promise<OperationResult<User>> {
        let response = await super.get<User>('/auth/getMe');
        if (response.data.result.prefs) {
            response.data.result.prefs.colorScheme = response.data.result.prefs.colorScheme.toLowerCase() as Theme;
        } 
        return response.data;
    }
    
    async login(values:loginForm):Promise<OperationResult<ApiAuthResponse>> {
        let response = await super.post<loginForm, ApiAuthResponse>('/auth/login', values);
        if (response.data.result.user.prefs?.colorScheme) {
            response.data.result.user.prefs!.colorScheme = response.data.result.user.prefs?.colorScheme.toLowerCase() as Theme;
        } 
        console.log(response.headers)
        let c = Cookies.get('auth-cookie');
        console.log('auth-cookie', c)
        Cookies.set('refreshToken', response.data.result.user.refreshToken, { expires: 7, secure: true });
        return response.data;
    }

    async signup(values:signupForm):Promise<OperationResult<ApiAuthResponse>> {
        const response = await super.post<signupForm, ApiAuthResponse>('/auth/signup', values);
        Cookies.set('refreshToken', response.data.result.user.refreshToken, { expires: 7 });
        return response.data;
    }
}