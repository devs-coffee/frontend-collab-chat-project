import { IMessage } from "./IMessage"
import { Server } from "./IServer"
import { User } from "./IUser"

export interface reduxData {
    authStatus: {
        isLogged: boolean,
        user: User | null
    }
    servers: {
        data: Server[],
        status: "idle" | "pending" | "succeed" | "failed",
        error?: string | null
    }
    users: {
        data: User[],
        status: "idle" | "pending" | "succeed" | "failed",
        error?: string | null
    },
    messages: {
        data: Record<string, IMessage[]>,
        status: "idle" | "pending" | "succeed" | "failed",
        error?: string | null
    }
}