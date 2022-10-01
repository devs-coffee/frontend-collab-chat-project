import { createSlice } from '@reduxjs/toolkit';
import data from '../datas/reduxDefault';

export const authSlice = createSlice({
    name: 'auth',
    initialState: data.authStatus,
    reducers: {
        setLogs: (state, action) => {
            state.isLogged = true;
            state.user = action.payload.user;
            localStorage.setItem('access_token', action.payload.access_token);
        },
        unsetLogs: (state) => {
            state.isLogged = false;
            state.user = null;
            localStorage.removeItem('access_token');
        }
    }
})

export const { setLogs, unsetLogs } = authSlice.actions;
export default authSlice.reducer;