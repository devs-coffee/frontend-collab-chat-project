import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import serversReducer from './serversSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        servers: serversReducer
    }
})
export type AppDispatch = typeof store.dispatch;