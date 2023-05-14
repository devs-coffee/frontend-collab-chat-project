import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import serversReducer from './serversSlice';
import usersReducer from './usersSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        servers: serversReducer,
        users: usersReducer
    }
})
export type AppDispatch = typeof store.dispatch;