import { ISkillState } from "../skills/skillSlice";
import { EItemCategory, IInventory } from "../inventory/inventorySlice";
import { EWeaponCategory, EWeaponType, IArmourItem, IWeaponState } from "../armoury/armourySlice";

export const allSkills: ISkillState = {
    'Acrobatics': { name: 'Acrobatics', level: 3, type: 'Ag' },
    'Athletics': { name: 'Athletics', level: 0, type: 'S' },
    'Awareness': { name: 'Awareness', level: 0, type: 'Per' },
    'Charm': { name: 'Charm', level: 0, type: 'Fel' },
    'Command': { name: 'Command', level: 0, type: 'Fel' },
    'Commerce': { name: 'Commerce', level: 0, type: 'Int' },
    'Common Lore': { name: 'Common Lore', level: 0, type: '' },
    'Deceive': { name: 'Deceive', level: 0, type: 'Fel' },
    'Dodge': { name: 'Dodge', level: 0, type: 'Ag' },
    'Forbidden Lore': { name: 'Forbidden Lore', level: 0, type: '' },
    'Interogate': { name: 'Interogate', level: 0, type: 'Fel' },
    'Inquiry': { name: 'Inquiry', level: 0, type: 'Fel' },
    'Intimidate': { name: 'Intimidate', level: 0, type: 'S' },
    'Linguistics': { name: 'Linguistics', level: 0, type: 'Int' },
    'Logic': { name: 'Logic', level: 0, type: 'Int' },
    'Medicae': { name: 'Medicae', level: 0, type: 'Int' },
    'Navigation (Surface)': { name: 'Navigation (Surface)', level: 0, type: 'Int' },
    'Navigation (Stellar)': { name: 'Navigation (Stellar)', level: 0, type: 'Int' },
    'Navigation (Warp)': { name: 'Navigation (Warp)', level: 0, type: 'Int' },
    'Operate (Aeronaut)': { name: 'Operate (Aeronaut)', level: 0, type: 'Ag' },
    'Operate (Surface)': { name: 'Operate (Surface)', level: 0, type: 'Ag' },
    'Operate (Voidship)': { name: 'Operate (Voidship)', level: 0, type: 'Ag' },
    'Parry': { name: 'Parry', level: 0, type: 'Ws' },
    'Psyniscience': { name: 'Psyniscience', level: 0, type: 'Per' },
    'Scholastic Lore': { name: 'Scholastic Lore', level: 0, type: 'Int' },
    'Scrutiny': { name: 'Scrutiny', level: 0, type: 'Per' },
    'Security': { name: 'Security', level: 0, type: 'Int' },
    'Sleight of Hand': { name: 'Sleight of Hand', level: 0, type: 'Ag' },
    'Stealth': { name: 'Stealth', level: 0, type: 'Ag' },
    'Tech-Use': { name: 'Tech-Use', level: 0, type: 'Int' },
    'Tracking': { name: 'Tracking', level: 0, type: 'Int' },
    'Trade': { name: 'Trade', level: 0, type: 'Ag' },
}

export const talents = [
    { name: "Total Recall1", tier: "1", description: "TODO" },
    { name: "Total Recall2", tier: "1", description: "TODO" },
    { name: "Total Recall3", tier: "1", description: "TODO" },
    { name: "Total Recall4", tier: "1", description: "TODO" },
    { name: "Total Recall5", tier: "1", description: "TODO" },
]


export const allWeapons: IWeaponState = {
    [`Autopistol`]: { name: 'Autopistol', category: EItemCategory.WEAPON, count: 1, weaponCategory: EWeaponCategory.PISTOL, damage: '1d10+2', range: 30, rof: 's/-/6', clip: 18, rld: 'FULL', type: EWeaponType.IMPACT, pen: 0, weight: 1.5 },
    [`Chaindagger`]: { name: 'Chaindagger', category: EItemCategory.WEAPON, count: 1, weaponCategory: EWeaponCategory.CHAIN, damage: '1d10+1', range: 0, rof: '', clip: 0, rld: '', type: EWeaponType.RENDING, pen: 0, weight: 1.5 },
}

export const allArmour: {[name: string]: IArmourItem} = {
    ['DummyArmour']: {
        name: 'DummyArmour',
            count: 1,
            category: EItemCategory.ARMOUR,
            body: 95

    }
}

export const allItems: IInventory = {
    'Medipack': {
        name: "Medipack",
        count: 3,
        category: EItemCategory.MISC,
        description: "Basic Medi-Pack kits will usually contain drugs and bandages to treat a variety of injuries and illnesses, such as cataplasm patches and contraseptics. More advanced models might include a diagnostic Cogitator with bio-scanner and probes to determine the patient's ailments. The most advanced types, available to the elite of the Imperium, can include cast sprays, tox wands, synthskin applicators and more."
    },
    'Data Slate': {
        name: 'Data Slate',
        count: 1,
        category: EItemCategory.MISC,
        description: 'Data Slate which can contain various informations.'
    },
    ...allWeapons,
    ...allArmour,
}



