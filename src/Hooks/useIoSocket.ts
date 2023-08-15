import { useContext } from "react";
import IoSocketContext from "../contexts/IoSocketContext";
const useIoSocket = () => {
    return useContext(IoSocketContext);
};

export default useIoSocket;