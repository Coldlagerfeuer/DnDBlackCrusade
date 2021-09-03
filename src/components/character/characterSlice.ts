import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EGods, godStringMap } from "../talents/talentSlice";

interface ICharacterState {
    characterName: string,
    devotion?: EGods,
    discord: {
        active: string,
        prod: string,
        debug: string,
        [key: string]: string,
    }
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
        discord: {
            active: 'prod',
            prod: '',
            debug: '',

        },
        layout: {
            left: [],
            main: [0, 1, 2, 3, 4, 5],
            right: [6]
        },
    } as ICharacterState,
    reducers: {
        importCharacter: (state, action) => {
            const { characterName, discord, layout, devotion } = action.payload
            state.characterName = characterName;
            state.discord = discord;
            state.layout = layout;
            state.devotion = devotion;
        },
        setCharacterName: (state, action) => {
            state.characterName = action.payload;
        },
        setDiscordServer: (state, action) => {
            state.discord.prod = action.payload
        },
        setDiscordServerDebug: (state, action) => {
            state.discord.debug = action.payload
        },
        setDiscordActive: (state, action) => {
            state.discord.active = action.payload
        },
        setDevotion: (state, action: PayloadAction<string>) => {
            state.devotion = godStringMap[action.payload]
        },
        setLayout: (state, action) => {
            console.log(action.payload)
            state.layout = action.payload
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

export const { importCharacter, setCharacterName, setDiscordActive, setDiscordServer, setDiscordServerDebug, setDevotion, setLayout, changeLayout } = characterSlice.actions
export default characterSlice.reducer
