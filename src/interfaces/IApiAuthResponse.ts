import { User } from "./IUser";

export interface ApiAuthResponse {
    access_token: string,
    user: User
}