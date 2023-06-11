import { ReactNode } from "react";
import socketIOClient from "socket.io-client";

import IoSocketContext from "../Contexts/IoSocketContext";

type IoSocketProviderProps = {
    children: ReactNode
}

function IoSocketProvider({children} : IoSocketProviderProps) {
    let ioUrl: string = "";
    if(process.env.REACT_APP_IO_URL) {
        ioUrl = process.env.REACT_APP_IO_URL;
    }
    const Socket = socketIOClient(ioUrl, { transports: ['websocket'], auth: {token: localStorage.getItem('access_token')}});

    function ioClose() {
        Socket.close();
    }

    const value = {
        Socket,
        ioClose
    }

    return (
        <IoSocketContext.Provider value={value}>
            {children}
        </IoSocketContext.Provider>
    )
}

export default IoSocketProvider;