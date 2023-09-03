import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import data from '../datas/reduxDefault';
import { IMessagesPayload } from '../interfaces/IMessagePayload';
import { MessageService } from '../services/messageService';
import { IMessage } from '../interfaces/IMessage';

export const messageSlice = createSlice({
    name: 'messages',
    initialState: data.messages,
    reducers: {
        setMessages: (state, action: PayloadAction<IMessagesPayload>) => {
            const { channelId, messages } = action.payload;
            state.data[channelId] = messages;
        },
        addOrUpdateMessage: (state, action: PayloadAction<IMessage>) => {
            const message = action.payload;
            const datas = [...state.data[message.channelId!]].map(elt => {return{...elt}});
            const oldMessage = datas.find(m => m.id === message.id);
            if(oldMessage) {
                oldMessage.content = message.content;
                
            }
            else {
                datas.push(message);
            }
            state.data[message.channelId!] = datas;
            const newState = {...state, datas};
            state = newState;
        },
        removeMessage: (state, action) => {
            const message = action.payload;
            state.data[message.channelId] = [...state.data[message.channelId].filter(m => m.id !== message.id)];
            //? return state;
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

export const { setMessages, addOrUpdateMessage, removeMessage } = messageSlice.actions;
export default messageSlice.reducer;