import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ITalent {
    name: string,
    tier: number,
    prerequisites: string,
    devotion?: EGods,
    description?: string
}

export enum EGods {
    KHORNE,
    NURGLE,
    SLAANESH,
    TZEENTCH,
    UNALIGNED
}

export interface ITalentState {
    [name: string]: ITalent
}

export const talentsInitialState = {
    'Total Recall': { name: "Total Recall", tier: 1, prerequisites: "-", description: "The character can automatically remember trivial facts or pieces of information the character might feasibly have picked up in the past. When dealing with more detailed, complex or obscure facts, such as the exact layout of a defence network, the GM may require a successful Intelligence Test to recall the information." },
} as ITalentState

export const talentSlice = createSlice({
    name: 'skills',
    initialState: talentsInitialState,
    reducers: {
        addTalent: (state, action: PayloadAction<ITalent>) => {
            const talent = action.payload;
            if (talent.name !== '') {
                state[talent.name] = talent
            }
        },
        removeTalent: (state, action) => {
            delete state[action.payload.name];
        },
        importTalents: (state, action) => {
            const talents = action.payload;
            for (const name in talents) {
                state[name] = talents[name];
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const { addTalent, removeTalent, importTalents } = talentSlice.actions
export default talentSlice.reducer

