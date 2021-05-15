import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { allItems } from "../character/resources";
import { EWeaponCategory, EWeaponType, IArmourItem, IWeapon } from "../armoury/armourySlice";

export enum EItemCategory {
    NONE = "-",
    WEAPON = "Weapon",
    ARMOUR = "Armour",
    MISC = "Misc",

}

export interface IItem {
    name: string,
    count: number,
    category: EItemCategory
    description?: string
}

export type TItem = IItem | IWeapon | IArmourItem;

export interface IInventory {
    [name: string]: TItem
}

export const itemsInitialState = {
    'Data Slate': {
        name: 'Data Slate',
        count: 1,
        category: EItemCategory.MISC,
        description: 'Data Slate which can contain various informations.'
    },
    'Autopistol': {
        name: 'Autopistol',
        category: EItemCategory.WEAPON,
        count: 1,
        weaponCategory: EWeaponCategory.PISTOL,
        damage: '1d10+2',
        range: 30,
        rof: 's/-/6',
        clip: 18,
        rld: 'FULL',
        type: EWeaponType.IMPACT,
        pen: 0,
        weight: 1.5
    },
    [`Chaindagger`]: {
        name: 'Chaindagger',
        category: EItemCategory.WEAPON,
        count: 1,
        weaponCategory: EWeaponCategory.CHAIN,
        damage: '1d10+1',
        range: 0,
        rof: '',
        clip: 0,
        rld: '',
        type: EWeaponType.RENDING,
        pen: 0,
        weight: 1.5
    },
    ['DummyArmour']: {
        name: 'DummyArmour',
        count: 1,
        category: EItemCategory.ARMOUR,
        body: 95

    }
} as IInventory

export const inventorySlice = createSlice({
    name: 'items',
    initialState: itemsInitialState,
    reducers: {
        addItem: (state, action: PayloadAction<IItem>) => {
            const { name } = action.payload;
            const oldCount = state[name]?.count
            state[name] = { ...action.payload, count: oldCount ? oldCount + 1 : 1 };
        },
        addItemByName: (state, action: PayloadAction<string>) => {
            const itemname = action.payload;
            if (state[itemname]) {
                state[itemname].count++;
            } else {
                console.log(itemname)
                console.log(allItems[itemname])
                console.log()
                const item = allItems[itemname];

                item ? state[itemname] = item
                    : state[itemname] = { name: itemname, count: 1, category: EItemCategory.NONE };
            }
        },
        changeWeaponName: (state, action: PayloadAction<IWeapon & { oldName: string }>) => {
            state[action.payload.name] = action.payload;
            delete state[action.payload.oldName]
        },
        editWeapon: (state, action: PayloadAction<IWeapon>) => {
            state[action.payload.name] = action.payload;
        },
        removeItem: (state, action: PayloadAction<TItem>) => {
            const item = action.payload;
            if (item.count === 1) {
                delete state[item.name];
            } else {
                state[item.name].count--;
            }
        },
        editDescription: (state, action: PayloadAction<IItem>) => {
            const item = action.payload;
            state[item.name].description = item.description
        },
        editCategory: (state, action: PayloadAction<IItem>) => {
            const item = action.payload;
            state[item.name].category = item.category
        },
        importInventory: (state, action) => {
            const inventory = action.payload;
            for (const name in inventory) {
                state[name] = inventory[name];
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const {
    addItem,
    addItemByName,
    changeWeaponName,
    editWeapon,
    removeItem,
    editDescription,
    editCategory,
    importInventory
} = inventorySlice.actions
export default inventorySlice.reducer

