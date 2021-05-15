import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { allSkills } from "../character/resources";

export interface ISkill {
    name: string,
    level: number,
    type?: string
}

export interface ISkillState {
    [name: string]: ISkill
}

const initialState = {
    'Acrobatics (Ag)': { name: 'Acrobatics (Ag)', level: 3, type: 'Ag'}
} as ISkillState

export const skillSlice = createSlice({
    name: 'skills',
    initialState: allSkills,
    reducers: {
        setLevel: (state, action: PayloadAction<ISkill>) => {
            const name: string = action.payload.name;
            if (state[name].level === action.payload.level) {
                state[name].level = 0;
            } else {
                state[name].level = action.payload.level;
            }
        },
        importSkills: (state, action) => {
            const skills = action.payload;
            for (const name in skills) {
                state[name] = skills[name];
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const { setLevel, importSkills } = skillSlice.actions
export default skillSlice.reducer

