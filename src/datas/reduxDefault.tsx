import { reduxData } from "../interfaces/IReduxData";

const data:reduxData = {
    authStatus: {
        isLogged: false,
        user: null
    },
    servers: {
        data: [],
        status: "idle",
        error: null
    },
    messages: {
        data: {},
        status: "idle",
        error: null
    }
};

export default data;