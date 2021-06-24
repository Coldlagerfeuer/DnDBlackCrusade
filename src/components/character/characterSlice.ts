import { createSlice } from "@reduxjs/toolkit";

export const characterSlice = createSlice({
    name: 'character',
    initialState: {
        characterName: 'Character Name',
        discordServer: ''
    },
    reducers: {
        importCompleteState: (state, action) => {
            state = action.payload
        },
        setCharacterName: (state, action) => {
            state.characterName = action.payload;
        },
        setDiscordServer: (state, action) => {
            state.discordServer = action.payload
        }
    },
});

export const { importCompleteState, setCharacterName, setDiscordServer } = characterSlice.actions
export default characterSlice.reducer
