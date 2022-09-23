import { createSlice } from '@reduxjs/toolkit';
import data from '../datas/reduxDefault';

export const authSlice = createSlice({
    name: 'auth',
    initialState: data.authStatus,
    reducers: {
        login: (state, action) => {
            state.isLogged = true;
            state.user = action.payload.pseudo;
        },
        signout: (state) => {
            state.isLogged = false;
            state.user = null
        }
    }
})

export const { login, signout } = authSlice.actions;
export default authSlice.reducer;