import { User } from "./IUser";

export interface ApiUserResponse {
    isSucceed: boolean,
    result: {
        user: User
    }
    errorMessage?: string;
}