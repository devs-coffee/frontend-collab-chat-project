import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import serversReducer from './serversSlice';
import messagesReducer from './messagesSlice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        servers: serversReducer,
        messages: messagesReducer
    }
})
export type AppDispatch = typeof store.dispatch;