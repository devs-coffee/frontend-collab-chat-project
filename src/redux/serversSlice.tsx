import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ServerService } from "../services/serverService";
import data from "../datas/reduxDefault";
import { Server } from "../interfaces/IServer";
import { OperationResult } from "../interfaces/IOperationResult";

const serverService = new ServerService();


export const serversSlice = createSlice({
    name: 'servers',
    initialState: data.servers,
    reducers: {
        setServers: (state, action) => {
            state.data = action.payload;
            return state;
        },
        addServer: (state, action) => {
            state.data.push(action.payload);
            return state;
        },
        removeServer: (state, action) => {
            state.data = [...state.data.filter(server => server.id !== action.payload)];
            return state;
        },
        updateServer: (state, action) => {
            const { id, name, picture, categories } = action.payload;
            const oldServer = state.data.find(server => server.id === id);
            if(oldServer) {
                oldServer.name = name;
                oldServer.picture = picture;
                oldServer.categories = categories;
            }
            return state;
        },
        unsetServers: (state) => {
            state.status = "idle";
            state.error = null;
            state.data = []
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchServers.pending, (state, actions) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(fetchServers.fulfilled, (state, action) => {
                state.status = "succeed";
                state.data = action.payload.result;
            })
            .addCase(fetchServers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
    }
})
export const { setServers, addServer, removeServer, updateServer, unsetServers } = serversSlice.actions;
export default serversSlice.reducer;

export const fetchServers = createAsyncThunk<
        OperationResult<Server[]>,
        void,
        {
            rejectValue: OperationResult<Server[]>
        }
    >('servers/fetchServers', async () => {
    const response:OperationResult<Server[]> = await serverService.getServers()
    .catch(error => {
        throw error.response.data.message;
    })
    return response;
    });
    
    
export const getServerList = (state:any) => state.data as Server[];
export const getServerById = (state:any, serverId:string) => state.data.find((server:Server) => server.id === serverId) as Server;