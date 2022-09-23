import { createSlice } from '@reduxjs/toolkit';
import data from '../datas/reduxDefault';

export const authSlice = createSlice({
    name: 'auth',
    initialState: data.authStatus,
    reducers: {
        login: (state, action) => {
            state.isLogged = true;
            state.user = action.payload.user;
            state.token = action.payload.access_token;
            localStorage.setItem('access_token', action.payload.access_token);
        },
        signout: (state) => {
            state.isLogged = false;
            state.user = null;
            state.token = null;
            localStorage.removeItem('access_token');
        }
    }
})

export const { login, signout } = authSlice.actions;
export default authSlice.reducer;