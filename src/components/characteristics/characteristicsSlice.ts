import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface ICharacteristics {
    name: string;
    value: number;
    short: string;
    bonus: number;
}

export interface ICharacteristicsState {
    [short: string]: ICharacteristics
}

export const characteristicsInitialState = {
    'WS': { name: "Weapon Skill", value: 30, short: 'WS', bonus: 0  },
    'BS': { name: "Ballistic Skill", value: 30, short: 'BS', bonus: 0 },
    'S': { name: "Strength", value: 30, short: 'S', bonus: 0 },
    'T': { name: "Toughness", value: 30, short: 'T', bonus: 1 },
    'AG': { name: "Agility", value: 30, short: 'AG', bonus: 0 },
    'I': { name: "Intelligence", value: 30, short: 'INT', bonus: 0 },
    'PER': { name: "Perception", value: 30, short: 'PER', bonus: 0 },
    'WP': { name: "Willpower", value: 30, short: 'WP', bonus: 0 },
    'FEL': { name: "Fellowship", value: 30, short: 'FEL', bonus: 0 },
    'INF': { name: "Infamy", value: 30, short: 'INF', bonus: 0 },
} as ICharacteristicsState


export const characteristicsSlice = createSlice({
    name: 'characteristics',
    initialState: characteristicsInitialState,
    reducers: {
        increment: (state, action: PayloadAction<string>) => {
            state[action.payload].value += 1
        },
        decrement: (state, action: PayloadAction<string>) => {
            state[action.payload].value -= 1
        },
        incrementBonus: (state, action: PayloadAction<string>) => {
            console.log(action.payload)
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
export const { increment, decrement, incrementBonus, decrementBonus, importCharacteristics } = characteristicsSlice.actions
export default characteristicsSlice.reducer
