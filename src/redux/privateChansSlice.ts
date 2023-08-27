import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import data from '../datas/reduxDefault';
import { OperationResult } from '../interfaces/IOperationResult';
import { ChannelService } from '../services/channelService';
import { PrivateChannel } from '../interfaces/IPrivateChannel';

export const privateChansSlice = createSlice({
    name: 'privateChans',
    initialState: data.privateChans,
    reducers: {
        setPrivateChannels: (state, action) => {
            state.data = action.payload;
            return state;
        }
    },
    extraReducers(builder) {
        builder
        .addCase(fetchPrivateChannels.pending, (state, actions) => {
            state.status = "pending";
            state.error = null;
        })
        .addCase(fetchPrivateChannels.fulfilled, (state, action) => {
            state.status = "succeed";
            state.data = action.payload.result;
        })
        .addCase(fetchPrivateChannels.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        })
    },
})

export const fetchPrivateChannels = createAsyncThunk<
        OperationResult<PrivateChannel[]>,
        void,
        {
            rejectValue: OperationResult<any[]>
        }
    >('channels/@me', async () => {
    const response:OperationResult<PrivateChannel[]> = await new ChannelService().getPrivateChannels()
    .catch(error => {
        throw error.response.data.message;
    })
    return response;
    });

export const {setPrivateChannels} = privateChansSlice.actions;
export default privateChansSlice.reducer;