import { ChannelBase } from "./IChannel.base"

export interface Server {
    id: string,
    name: string,
    picture?: string,
    isPrivate: boolean,
    categories: string[],
    channels: ChannelBase[]
    isCurrentUserAdmin: boolean
}