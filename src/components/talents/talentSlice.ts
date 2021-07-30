import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { allTalents } from "../character/resources";

export interface ITalent {
    name: string,
    tier: number,
    prerequisites?: string,
    devotion?: EGods,
    description?: string,
    specialization?: string
}

export enum EGods {
    KHORNE = "Khorne",
    NURGLE = "Nurgle",
    SLAANESH = "Slaanesh",
    TZEENTCH = "Tzeentch",
    UNALIGNED = "Unaligned",
    SPECIAL = "Special"
}

/**
Tier 1 Talente (T:200xp/A:250xp/O:500xp)
Tier 2 Talents (T:300xp/A:500xp/O:750xp)
Tier 3 Talents (T:400xp/A:750xp/O:1000xp)
 */
export const expMap = [
    [200, 250, 500],
    [300, 500, 750],
    [400, 750, 1000]
];

export const devotionMap = {
    [EGods.UNALIGNED]: {
        [EGods.UNALIGNED]: 1,
        [EGods.SPECIAL]: 1,
        [EGods.KHORNE]: 1,
        [EGods.NURGLE]: 1,
        [EGods.TZEENTCH]: 1,
        [EGods.SLAANESH]: 1,
    },
    [EGods.KHORNE]: {
        [EGods.UNALIGNED]: 1,
        [EGods.SPECIAL]: 1,
        [EGods.KHORNE]: 0,
        [EGods.NURGLE]: 1,
        [EGods.TZEENTCH]: 2,
        [EGods.SLAANESH]: 2,
    },
    [EGods.NURGLE]: {
        [EGods.UNALIGNED]: 1,
        [EGods.SPECIAL]: 1,
        [EGods.KHORNE]: 1,
        [EGods.NURGLE]: 0,
        [EGods.TZEENTCH]: 2,
        [EGods.SLAANESH]: 2,
    },
    [EGods.TZEENTCH]: {
        [EGods.UNALIGNED]: 1,
        [EGods.SPECIAL]: 1,
        [EGods.KHORNE]: 2,
        [EGods.NURGLE]: 2,
        [EGods.TZEENTCH]: 0,
        [EGods.SLAANESH]: 1,
    },
    [EGods.SLAANESH]: {
        [EGods.UNALIGNED]: 1,
        [EGods.SPECIAL]: 1,
        [EGods.KHORNE]: 2,
        [EGods.NURGLE]: 2,
        [EGods.TZEENTCH]: 1,
        [EGods.SLAANESH]: 0,
    },
    [EGods.SPECIAL]: {
        [EGods.UNALIGNED]: 1,
        [EGods.SPECIAL]: 1,
        [EGods.KHORNE]: 1,
        [EGods.NURGLE]: 1,
        [EGods.TZEENTCH]: 1,
        [EGods.SLAANESH]: 1,
    }
};

export interface ITalentState {
    [name: string]: ITalent
}

export const talentsInitialState = {
    'Total Recall': { name: "Total Recall", tier: 1, devotion: EGods.UNALIGNED, prerequisites: "-", description: "The character can automatically remember trivial facts or pieces of information the character might feasibly have picked up in the past. When dealing with more detailed, complex or obscure facts, such as the exact layout of a defence network, the GM may require a successful Intelligence Test to recall the information." },
} as ITalentState

export const talentSlice = createSlice({
    name: 'skills',
    initialState: talentsInitialState,
    reducers: {
        addTalent: (state, action: PayloadAction<ITalent>) => {
            const talent = action.payload;
            if (talent.name !== '') {
                state[talent.name] = talent

                if (!allTalents[talent.name]) {
                    allTalents[talent.name] = talent;
                }

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

