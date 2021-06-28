import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICharacterState {
    characterName: string,
    discordServer: string,
    layout: {
        left: number[],
        main: number[],
        right: number[],
        [key: string]: number[]
    },
}

export const characterSlice = createSlice({
    name: 'character',
    initialState: {
        characterName: 'Character Name',
        discordServer: '',
        layout: {
            left: [1],
            main: [0, 2, 3, 4, 5],
            right: []
        },
    } as ICharacterState,
    reducers: {
        importCompleteState: (state, action) => {
            state = action.payload
        },
        setCharacterName: (state, action) => {
            state.characterName = action.payload;
        },
        setDiscordServer: (state, action) => {
            state.discordServer = action.payload
        },
        changeLayout: (state, action: PayloadAction<{field: string, index: number}>) => {
            const {field, index} = action.payload;

            if (state.layout.left.indexOf(index) >= 0) { state.layout.left.splice(state.layout.left.indexOf(index), 1) }
            if (state.layout.main.indexOf(index) >= 0) { state.layout.main.splice(state.layout.main.indexOf(index), 1) }
            if (state.layout.right.indexOf(index) >= 0) { state.layout.right.splice(state.layout.right.indexOf(index), 1) }

            state.layout[field].push(index);
            state.layout[field].sort();

        }
    },
});

export const { importCompleteState, setCharacterName, setDiscordServer, changeLayout } = characterSlice.actions
export default characterSlice.reducer
