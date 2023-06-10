import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import serversReducer from './serversSlice';
import usersReducer from './usersSlice';
import messagesReducer from './messagesSlice'
export const store = configureStore({
    reducer: {
        authStatus: authReducer,
        servers: serversReducer,
        users: usersReducer,
        messages: messagesReducer
    }
})
export type AppDispatch = typeof store.dispatch;