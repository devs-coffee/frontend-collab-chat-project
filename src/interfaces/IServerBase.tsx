import { ChannelBase } from "./IChannel.base"

export interface ServerBase {
    id: string,
    name: string,
    picture?: string,
    isPrivate: boolean,
    categories: string[],
    channels: ChannelBase[]
}