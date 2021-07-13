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
            const { name, parent } = action.payload;
            const key = parent ? `${parent.name} - ${name}` : name;
            if (state[key].level === action.payload.level) {
                state[key].level = 0;
            } else {
                state[key].level = action.payload.level;
            }
        },
        setBonus: (state, action: PayloadAction<ISkill>) => {
            const {name, bonus, parent} = action.payload;
            const key = parent ? `${parent.name} - ${name}` : name;
            state[key].bonus = bonus;
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

