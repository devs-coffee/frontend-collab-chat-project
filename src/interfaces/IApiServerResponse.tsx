import { Server } from "./IServer";

export interface ApiServerResponse {
    isSucceed: boolean,
    result: {
        server: Server
    }
}