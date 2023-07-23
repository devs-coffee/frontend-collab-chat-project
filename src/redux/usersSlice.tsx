import { createSlice } from "@reduxjs/toolkit";

import data from "../datas/reduxDefault";
import { User } from "../interfaces/IUser";

export const usersSlice = createSlice({
    name: 'users',
    initialState: data.users,
    reducers: {
        addUsers: (state, action) => {
            action.payload.forEach((user: User) => {
                state.data.push(user);
            })
            
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