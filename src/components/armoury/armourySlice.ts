import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IItem } from "../inventory/inventorySlice";

export enum EWeaponCategory {
    PISTOL,
    _,
    SWORD,
    CHAIN,
}


export interface IWeapon extends IItem{
    weaponCategory: EWeaponCategory,
    damage: string,
    range: number,
    rof: string,
    clip: number,
    rld: string
    type: EDamageType,
    pen: number,
    weight: number,
    additionalRolls?: number,
}

export enum ESpellType {
    ATTACK = "Attack",
    CONCENTRATION = "Concentration"
}

export interface ISpell extends IItem {
    exp: number,
    prerequisites: string,
    action: string,
    focusPower: string,
    range: string,
    sustained: boolean | string,
    subtype: ESpellType[],
    pen: number,
    damage: string,
    type: EDamageType,
}

export interface IWeaponState {
    [name: string]: IWeapon | ISpell
}

export enum EDamageType {
    IMPACT,
    RENDING,
    SCHOCK,
    LASER,
    ENERGY,
    EXPLOSIVE,

    MISC,
    BUFF,
    CURSE,
}


export interface IArmourStats {
    head?: number,
    body?: number,
    armR?: number,
    armL?: number,
    legR?: number,
    legL?: number
}

export interface IArmour extends IItem, IArmourStats {}

export interface IArmouryState {
    armour: IArmourStats,
    gear: {[name: string]: IArmour},
    weapons: IWeaponState,
    character: {
        currentWounds: number,
        maxWounds: number,
        currentInfamy: number,
    }
}

export const armouryInitalState = {
    armour: {
        head: 0,
        body: 0,
        armR: 0,
        armL: 0,
        legR: 0,
        legL: 0,
    },
    gear: { },
    weapons: {},
    character: {
        currentWounds: 5,
        maxWounds: 7,
        currentInfamy: 2
    }
} as IArmouryState

export const armourySlice = createSlice({
    name: 'armoury',
    initialState: armouryInitalState,
    reducers: {
        setGear: (state, action: PayloadAction<IArmour>) =>  {
            const { head, body, armL, armR, legL, legR, name } = action.payload;

            state.armour.head = head ? head : state.armour.head
            state.armour.body = body ? body : state.armour.body
            state.armour.armL = armL ? armL : state.armour.armL
            state.armour.armR = armR ? armR : state.armour.armR
            state.armour.legL = legL ? legL : state.armour.legL
            state.armour.legR = legR ? legR : state.armour.legR

          state.gear[name] = action.payload;
        },
        removeGear: (state, action: PayloadAction<IArmour>) =>  {
            const { head, body, armL, armR, legL, legR, name } = action.payload;

            state.armour.head = head ? 0 : state.armour.head
            state.armour.body = body ? 0 : state.armour.body
            state.armour.armL = armL ? 0 : state.armour.armL
            state.armour.armR = armR ? 0 : state.armour.armR
            state.armour.legL = legL ? 0 : state.armour.legL
            state.armour.legR = legR ? 0 : state.armour.legR

            delete state.gear[name]
        },
        setWeapon: (state, action: PayloadAction<IWeapon | ISpell>) => {
            state.weapons[action.payload.name] = {...action.payload, count: 1};
        },
        removeWeapon: (state, action) => {
            delete state.weapons[action.payload.name];
        },
        setWounds: (state, action: PayloadAction<number>) => {
            state.character.currentWounds = action.payload
        },
        setMaxWounds: (state, action) => {
            state.character.maxWounds = action.payload
        },
        importArmoury: (state, action: PayloadAction<IArmouryState>) => {
            const { armour, gear, weapons, character  } = action.payload;
            state.armour = armour;
            state.gear = gear;
            state.weapons = weapons;
            state.character = character;
        }
    },
});

// Action creators are generated for each case reducer function
export const { setGear, removeGear, setWeapon, removeWeapon, setWounds, setMaxWounds, importArmoury } = armourySlice.actions
export default armourySlice.reducer

