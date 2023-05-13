import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import data from '../datas/reduxDefault';
import { IMessagesPayload, IMessagePayload } from '../interfaces/IMessagePayload';
import { MessageService } from '../services/messageService';

export const messageSlice = createSlice({
    name: 'messages',
    initialState: data.messages,
    reducers: {
        setMessages: (state, action: PayloadAction<IMessagesPayload>) => {
            const { channelId, messages } = action.payload;
            state.data[channelId] = messages;
            return state;
        },
        addMessage: (state, action: PayloadAction<IMessagePayload>) => {
            const { channelId, message } = action.payload;
            state.data[channelId].push(message);
            return state;
        },
        removeMessage: (state, action: PayloadAction<IMessagePayload>) => {
            const { channelId, message } = action.payload;
            state.data[channelId] = [...state.data[channelId].filter(m => m.id !== message.id)];
            return state;
        },
        updateMessage: (state, action: PayloadAction<IMessagePayload>) => {
            const { channelId, message } = action.payload;
            const datas = [...state.data[channelId]].map(elt => {return{...elt}});
            const oldServer = datas.find(m => m.id === message.id);
            if(oldServer) {
                oldServer.content = message.content;
            }
            state.data[channelId] = datas;
            const newState = {...state, datas};
            state = newState;
        },
    },
    extraReducers(builder) {
        builder
        .addCase(fetchMessages.pending, (state, actions) => {
            state.status = "pending";
            state.error = null;
        })
        .addCase(fetchMessages.fulfilled, (state, action) => {
            if(action.payload){
                const { channelId, messages } = action.payload!;
                state.status = "succeed";
                state.data[channelId] = messages;
            } else {
                state.data = {};
            }
        })
        .addCase(fetchMessages.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        })
    },
})

export const fetchMessages = createAsyncThunk<IMessagesPayload | undefined, string>('messages/fetchMessages', async (channelId: string) => {
    const response = await new MessageService().getMessagesByChannelId(channelId)
    if(response.isSucceed){
        const messages: IMessagesPayload = {
            'channelId': channelId,
            'messages': response.result
        };
        return messages;
    }
  })

export const { setMessages, addMessage, removeMessage, updateMessage } = messageSlice.actions;
export default messageSlice.reducer;