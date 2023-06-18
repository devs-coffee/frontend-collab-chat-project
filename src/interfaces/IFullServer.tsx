import { ChannelBase } from "./IChannel.base"
import { Server } from "./IServer"

export interface FullServer extends Server {
    isCurrentUserAdmin: boolean
    isCurrentUserMember: boolean
}