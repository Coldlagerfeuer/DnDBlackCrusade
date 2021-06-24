import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { allSkills } from "../character/resources";

export interface ISkill {
    name: string,
    level: number,
    type: string,
    bonus: number,
    parent?: ISkill
}

export interface ISkillState {
    [name: string]: ISkill
}

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
        setBonus: (state, action: PayloadAction<ISkill>) => {
            const {name, bonus} = action.payload;
            state[name].bonus = bonus;
        },
        importSkills: (state, action) => {
            const skills = action.payload;
            for (const name in skills) {
                state[name] = skills[name];
                // Migration
                if (!state[name].bonus) {
                    state[name].bonus = 0
                }
            }
        },
        addSkill: (state, action: PayloadAction<ISkill>) => {
            const {name, parent} = action.payload;
            if (parent) {
                state[`${parent.name} - ${name}`] = action.payload
            } else {
                state[name] = action.payload;
            }

        }
    }
})

// Action creators are generated for each case reducer function
export const { setLevel, setBonus, importSkills, addSkill } = skillSlice.actions
export default skillSlice.reducer

