import { createSlice } from "@reduxjs/toolkit";

import data from "../datas/reduxDefault";

export const usersSlice = createSlice({
    name: 'users',
    initialState: data.users,
    reducers: {
        addUsers: (state, action) => {
            state.data.push(action.payload);
        },
        updateUser: (state, action) => {
            const oldUser = state.data.find(user => user.id === action.payload.id);
            if(oldUser) {
                oldUser.pseudo = action.payload.pseudo;
                if(action.payload.picture) {
                    oldUser.picture = action.payload.picture;
                }
            }
        }
    }
})
export const { addUsers, updateUser } = usersSlice.actions;
export default usersSlice.reducer;