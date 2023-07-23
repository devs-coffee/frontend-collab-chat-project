import { ServerBase } from "./IServerBase"

export interface Server extends ServerBase {
    isCurrentUserAdmin: boolean
    isCurrentUserMember: boolean
}