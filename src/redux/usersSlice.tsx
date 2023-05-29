import { createSlice, current } from "@reduxjs/toolkit";

import data from "../datas/reduxDefault";
import { User } from "../interfaces/IUser";

export const usersSlice = createSlice({
    name: 'users',
    initialState: data.users,
    reducers: {
        addUsers: (state, action) => {
            const newState = [...state.data, ...action.payload];
            
            state.data = [...new Map(newState.map(item => [item.id, item])).values()];
            //console.log(current(state.data));
            return state;
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