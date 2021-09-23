import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EGods } from "../talents/talentSlice";


export interface ICharacteristics {
    name: string;
    value: number;
    short: string;
    bonus: number;
    devotion: EGods;
}

export interface ICharacteristicsState {
    [short: string]: ICharacteristics
}

export const expMapCharacteristics = [
    [100, 250, 500, 750],
    [250, 500, 750, 1000],
    [500, 750, 1000, 2500]
]

export const characteristicsInitialState = {
    'WS': { name: "Weapon Skill", value: 30, short: 'WS', bonus: 0, devotion: "Unaligned"  },
    'BS': { name: "Ballistic Skill", value: 30, short: 'BS', bonus: 0, devotion: "Unaligned" },
    'S': { name: "Strength", value: 30, short: 'S', bonus: 0, devotion: "Khorne" },
    'T': { name: "Toughness", value: 30, short: 'T', bonus: 0, devotion: "Nurgle" },
    'AG': { name: "Agility", value: 30, short: 'AG', bonus: 0, devotion: "Unaligned" },
    'INT': { name: "Intelligence", value: 30, short: 'INT', bonus: 0, devotion: "Unaligned" },
    'PER': { name: "Perception", value: 30, short: 'PER', bonus: 0, devotion: "Unaligned" },
    'WP': { name: "Willpower", value: 30, short: 'WP', bonus: 0, devotion: "Tzeentch" },
    'FEL': { name: "Fellowship", value: 30, short: 'FEL', bonus: 0, devotion: "Slaanesh" },
    'INF': { name: "Infamy", value: 30, short: 'INF', bonus: 0, devotion: "Unaligned" },
    'COR': { name: "Corruption", value: 0, short: 'COR', bonus: 0, devotion: "Unaligned"}
} as ICharacteristicsState


export const characteristicsSlice = createSlice({
    name: 'characteristics',
    initialState: characteristicsInitialState,
    reducers: {
        increment: (state, action: PayloadAction<string>) => {
            state[action.payload].value += 1
        },
        incrementFive: (state, action: PayloadAction<string>) => {
            state[action.payload].value += 5
        },
        decrement: (state, action: PayloadAction<string>) => {
            state[action.payload].value -= 1
        },
        incrementBonus: (state, action: PayloadAction<string>) => {
            state[action.payload].bonus += 1
        },
        decrementBonus: (state, action: PayloadAction<string>) => {
            state[action.payload].bonus > 0 ? state[action.payload].bonus -= 1 : state[action.payload].bonus = 0;
        },
        importCharacteristics: (state, action) => {
            const characteristics = action.payload;
            for (const stat in characteristics) {
                state[stat] = characteristics[stat]
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { increment, incrementFive, decrement, incrementBonus, decrementBonus, importCharacteristics } = characteristicsSlice.actions
export default characteristicsSlice.reducer
