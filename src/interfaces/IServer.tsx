import { Channel } from "./IChannel";
import { User } from "./IUser";

export interface Server {
    id: string,
    name: string,
    picture?: string,
    users?: User[],
    channels?: Channel[]
}