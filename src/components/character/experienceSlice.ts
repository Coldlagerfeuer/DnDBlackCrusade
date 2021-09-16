import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EGods } from "../talents/talentSlice";


export interface IExpEntry {
    description: string,
    amount: number,
    devotion: EGods,
    type: string, // SKILL, ADV, SPELL, CHAR
}

interface IExpState {
    entries: IExpEntry[],
    expSum: number
}

export const experienceSlice = createSlice({
    name: 'experience',
    initialState: {
        entries: [
            {description: "Adventure1", amount: 1500, devotion: EGods.UNALIGNED, type: "ADV"},
            {description: "Skill1", amount: -150, devotion: EGods.NURGLE, type: "ADV"},
            {description: "Skill2", amount: -300, devotion: EGods.UNALIGNED, type: "ADV"},
            {description: "Skill3", amount: -200, devotion: EGods.UNALIGNED, type: "ADV"},
            {description: "Adventure2", amount: 150, devotion: EGods.UNALIGNED, type: "ADV"},
            {description: "Skill4", amount: -1000, devotion: EGods.UNALIGNED, type: "ADV"},
        ],
        expSum: 0
    } as IExpState,
    reducers : {
        importExperience: (state, action: PayloadAction<IExpState>) => {
            const { entries, expSum } = action.payload
            state.entries = entries;
            state.expSum = expSum;
        },
        addEntry: (state, action: PayloadAction<IExpEntry>) => {
            state.expSum += action.payload.amount;
            state.entries.push(action.payload);
        },
        removeEntry: (state, action: PayloadAction<number>) => {
            state.expSum -= state.entries.splice(action.payload, 1)[0]?.amount
        },
    }
})

export const { importExperience, addEntry, removeEntry } = experienceSlice.actions
export default experienceSlice.reducer
