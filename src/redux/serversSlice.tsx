import { createSlice } from "@reduxjs/toolkit";
import data from "../datas/reduxDefault";

export const serversSlice = createSlice({
    name: 'servers',
    initialState: data.servers,
    reducers: {
        setServers: (state, action) => {
            state = action.payload;
            return state;
        },
        addServer: (state, action) => {
            state.push(action.payload);
            return state;
        },
        removeServer: (state, action) => {
            state = [...state.filter(server => server.id !== action.payload)];
            return state;
        },
        updateServer: (state, action) => {
            const { id, name, picture } = action.payload;
            const oldServer = state.find(server => server.id === id);
            if(oldServer) {
                oldServer.name = name;
                oldServer.picture = picture;
            }
            return state;
        }
    }
})

export const { setServers, addServer, removeServer, updateServer } = serversSlice.actions;
export default serversSlice.reducer;