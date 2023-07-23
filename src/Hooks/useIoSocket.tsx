import { useContext } from "react";
import IoSocketContext from "../Contexts/IoSocketContext";

const useIoSocket = () => {
    return useContext(IoSocketContext);
};

export default useIoSocket;