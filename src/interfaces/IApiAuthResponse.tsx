import { User } from "./IUser";

export interface ApiAuthResponse {
    isSucceed: boolean,
    result: {
        access_token: string,
        user: User
    }
    
}