import { createSlice } from "@reduxjs/toolkit";

export const characterSlice = createSlice({
    name: 'character',
    initialState: {},
    reducers: {
        importCompleteState: (state, action) => {

            state = action.payload
        }
    },
});

export const { importCompleteState } = characterSlice.actions
export default characterSlice.reducer
