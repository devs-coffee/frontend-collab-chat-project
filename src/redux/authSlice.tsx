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
            return state;
        },
        unsetLogs: (state) => {
            state.isLogged = false;
            state.user = null;
            localStorage.removeItem('access_token');
            return state;
        },
        setUser: (state, action) => {
            state.isLogged = true;
            state.user = action.payload;
            return state;
        }
    }
})

export const { setLogs, unsetLogs, setUser } = authSlice.actions;
export default authSlice.reducer;