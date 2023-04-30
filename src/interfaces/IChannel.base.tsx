export interface ChannelBase {
    id: string,
    title: string
}

export interface ChannelCreationValues {
    title: string,
    serverId: string
}

export interface ChannelCreationErrors {
    title?: string
}