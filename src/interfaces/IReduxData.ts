import { IMessage } from "./IMessage"
import { PrivateChannel } from "./IPrivateChannel"
import { Server } from "./IServer"
import { User } from "./IUser"

type SliceStatus = "idle" | "pending" | "succeed" | "failed"

export interface reduxData {
    authStatus: {
        isLogged: boolean,
        user: User | null
    }
    servers: {
        data: Server[],
        status: SliceStatus,
        error?: string | null
    },
    messages: {
        data: Record<string, IMessage[]>,
        status: SliceStatus,
        error?: string | null
    }
    users: {
        data: User[],
        status: SliceStatus,
        error?: string | null
    }
    privateChans: {
        data: PrivateChannel[],
        status: SliceStatus,
        error?: string | null
    }
}