import { User } from "./IUser";

export interface ApiUserServerResponse {
    isSucceed: boolean,
    errorMessage?: string,
    result: User[]
}