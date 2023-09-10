import { createSlice } from '@reduxjs/toolkit';
import data from '../datas/reduxDefault';
import Cookies from 'js-cookie';

export const authSlice = createSlice({
    name: 'authStatus',
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
            Cookies.remove('refreshToken');
        },
        setUser: (state, action) => {
            state.isLogged = true;
            state.user = action.payload;
        }
    }
})

export const { setLogs, unsetLogs, setUser } = authSlice.actions;
export default authSlice.reducer;