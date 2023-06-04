import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import data from "../datas/reduxDefault";

import { OperationResult } from "../interfaces/IOperationResult";
import { Server } from "../interfaces/IServer";
import { ServerService } from "../services/serverService";


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
            const { id, name, picture, categories, channels } = action.payload;
            const data = [...state.data].map(elt => {return{...elt}});
            const oldServer = data.find(server => server.id === id);
            if(oldServer) {
                oldServer.name = name;
                oldServer.picture = picture;
                oldServer.categories = categories;
                oldServer.channels = channels;
            }
            state.data = data;
            const newState = {...state, data};
            state = newState;
        },
        addChannel: (state, action) => {
            const { serverId } = action.payload;
            const newChannel = {...action.payload};
            delete newChannel.serverId;
            state.data.find(server => server.id === serverId)?.channels.push(newChannel);
            return state;
        },
        removeChannel: (state, action) => {
            const server = state.data.find(server => server.id === action.payload.serverId);
            if(server) {
                server.channels = server.channels.filter(chan => chan.id !== action.payload.id);
            }
            return state;
        },
        updateChannel: (state, action) => {
            const channel = state.data.find(server => server.id === action.payload.serverId)?.channels.find(chan => chan.id === action.payload.id);
            if(channel) {
                channel.title = action.payload.title;
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
export const { setServers, addServer, removeServer, updateServer, unsetServers, addChannel, removeChannel, updateChannel } = serversSlice.actions;
export default serversSlice.reducer;

export const fetchServers = createAsyncThunk<
        OperationResult<Server[]>,
        void,
        {
            rejectValue: OperationResult<Server[]>
        }
    >('servers/fetchServers', async () => {
    const response:OperationResult<Server[]> = await new ServerService().getServers()
    .catch(error => {
        throw error.response.data.message;
    })
    return response;
    });
    
    
export const getServerList = (state:any) => state.data as Server[];
export const getServerById = (state:any, serverId:string) => state.data.find((server:Server) => server.id === serverId) as Server;