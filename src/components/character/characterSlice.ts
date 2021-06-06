import { createSlice } from "@reduxjs/toolkit";

export const characterSlice = createSlice({
    name: 'character',
    initialState: {
        characterName: 'Character Name'
    },
    reducers: {
        importCompleteState: (state, action) => {
            state = action.payload
        },
        setCharacterName: (state, action) => {
            state.characterName = action.payload;
        }
    },
});

export const { importCompleteState, setCharacterName } = characterSlice.actions
export default characterSlice.reducer
