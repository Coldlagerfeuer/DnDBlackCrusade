import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface IExpEntry {
    description: string,
    amount: number
}

interface IExpState {
    entries: IExpEntry[]
}

export const experienceSlice = createSlice({
    name: 'experience',
    initialState: {
        entries: [
            {description: "Adventure1", amount: 1500},
            {description: "Skill1", amount: -150},
            {description: "Skill2", amount: -300},
            {description: "Skill3", amount: -200},
            {description: "Adventure2", amount: 150},
            {description: "Skill4", amount: -300},
        ]
    } as IExpState,
    reducers : {
        addEntry: (state, action: PayloadAction<IExpEntry>) => {
            state.entries.push(action.payload);
        },
        removeEntry: (state, action: PayloadAction<number>) => {
            state.entries.splice(action.payload, 1)
        }
    }
})

export const { addEntry, removeEntry } = experienceSlice.actions
export default experienceSlice.reducer
