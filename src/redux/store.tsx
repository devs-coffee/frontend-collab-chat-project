import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import serversReducer from './serversSlice';
export default configureStore({
    reducer: {
        auth: authReducer,
        servers: serversReducer
    }
})