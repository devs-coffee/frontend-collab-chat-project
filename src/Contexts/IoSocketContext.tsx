import { createContext } from "react";
import { IoProvider } from "../interfaces/IIoProvider";

const IoSocketContext = createContext<IoProvider | null>(null);

export default IoSocketContext;