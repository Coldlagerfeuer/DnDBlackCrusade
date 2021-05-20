import { ISkillState } from "../skills/skillSlice";
import { EItemCategory, IInventory } from "../inventory/inventorySlice";
import { EWeaponCategory, EWeaponType, IArmourItem, IWeaponState } from "../armoury/armourySlice";
import { EGods, ITalentState } from "../talents/talentSlice";

export const allSkills: ISkillState = {
    'Acrobatics': { name: 'Acrobatics', level: 0, type: 'Ag' },
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

export const allTalents = {
    'Air of Authority': {
        name: "Air of Authority",
        tier: 1,
        prerequisites: "Fel 30",
        devotion: EGods.SLAANESH,
        description: "When making Command Skill Tests, the character may affect a number of targets equal to 10 times his Fellowship bonus. If the character has Minions (see page 135) they are also more devoted to him and add +10 to their Loyalty when in his presence. This talent has no effect on hostile targets, and only affects NPCs."
    },
    'Ambidextrous': {
        name: "Ambidextrous",
        tier: 1,
        prerequisites: "Ag 30",
        devotion: EGods.UNALIGNED,
        description: "The character may use either hand equally well for any task, and does not suffer the –20 penalty for actions using his off hand. Special: When combined with the Two-Weapon Wielder Talent, the penalty for making attacks with both weapons in the same Turn drops to –10."
    },
    'Ancient Warrior': {
        name: "Ancient Warrior",
        tier: 1,
        prerequisites: "",
        devotion: EGods.UNALIGNED,
        description: "This Talent must be taken at Character Creation. The character can command special respect from other veterans of the Long War and gains a +10 to all Fellowship Tests and Skill Tests based on Fellowship when dealing with such NPCs. In addition, Chaos Space Marine Minions of the character increase their loyalty by +10. Long War weaponry is also easier for him to obtain and all weapons with the word “Legion” in the title count as one Availability category easier than normal (i.e. Rare becomes Scarce, Scarce becomes Average, etc.). Finally, veterans of the Long War are despised by the Imperium and the Adeptus Astartes especially, and should the character’s past become known by these powers it is likely to end in blood…"
    },
    'Armour-Monger': { name: "Armour-Monger", tier: 2, prerequisites: "Int 35, Tech Use, Trade (Armorer)", devotion: EGods.UNALIGNED, description: "The character increases the Armour Points of any armour he wears by 2 on all locations it would normally cover as long as he has at least an hour each day to clean and repair it or make minor modiﬁ cations. This bonus applies only to armour worn by the character as it combines his training as much as his skill at armoury." },
    'Arms Master': { name: "Arms Master", tier: 3, prerequisites: "WS 40, BS 40, Weapon Training (any two)", devotion: EGods.UNALIGNED, description: "When the Heretic uses a weapon he is untrained in, he only suffers a –10 penalty, rather than a –20. The only exceptions to the Arms Master Talent are exotic weapons, which are so unusual or rare that they always require their own weapon training Talents to use without penalty and gain no bonus when combined with this talent." },
    'Assassin Strike': { name: "Assassin Strike", tier: 3, prerequisites: "Ag 40, Acrobatics", devotion: EGods.SLAANESH, description: "After making a melee attack, a successful Acrobatics Skill Test allows the character to move at half rate as a Free Action. The character’s opponent does not receive a free attack resulting from this move. The character may only make this move once per round." },
    'Baleful Dirge': { name: "Baleful Dirge", tier: 2, prerequisites: "Disturbing Voice, Intimidate +10", devotion: EGods.NURGLE, description: "Singing the dirge takes some concentration and requires a Half Action each round to maintain. All creatures which can hear the character within a 30-metre radius must make a Willpower Test or suffer a –10 on their next roll. As long as the dirge is maintained, all those affected by it must test each turn to see if they suffer its effects. Once a creature passes a Willpower Test however, it has completely overcome the dirge and is not affected by it for the remainder of the encounter." },
    'Bastion of Iron Will': { name: "Bastion of Iron Will", tier: 3, prerequisites: "Psy Rating, Strong Minded, WP 40", devotion: EGods.TZEENTCH, description: "The character adds 5 x his Psy Rating on any Opposed Test involving defending against the Psyniscience Skill or Psychic Powers." },
    'Battle Rage': { name: "Battle Rage", tier: 2, prerequisites: "Frenzy", devotion: EGods.KHORNE, description: "The character may Parry while frenzied. In addition such is the character’s control he may reroll a failed roll to snap out of Frenzy or resist entering Frenzy if he so chooses." },
    'Berserk Charge': { name: "Berserk Charge", tier: 1, prerequisites: "-", devotion: EGods.KHORNE, description: "If the character uses the Charge Action, he gains a +30 bonus to Weapon Skill instead of +20." },
    'Betrayer': { name: "Betrayer", tier: 2, prerequisites: "Cold Hearted, Intimidate", devotion: EGods.UNALIGNED, description: "Once per game session the character may kill either an allied NPC (i.e. an NPC which is openly friendly toward the PC and trusts him) or one of his own Minions. Such calculated cruelty boosts the Heretic’s reputation, granting him a +10 bonus on his next Infamy Test if the victim was an NPC and +20 if it was a Minion (and harder to replace). Killing NPCs and Minions usually has consequences as well which should be determined by the GM." },
    'EMPTY': { name: "EMPTY", tier: 1, prerequisites: "", devotion: EGods.UNALIGNED, description: "TODO" },
    'Total Recall': { name: "Total Recall", tier: 1, prerequisites: "", devotion: EGods.UNALIGNED, description: "TODO" },
} as ITalentState


export const allWeapons: IWeaponState = {
    'Autopistol': { name: 'Autopistol', category: EItemCategory.WEAPON, count: 1, weaponCategory: EWeaponCategory.PISTOL, damage: '1d10+2', range: 30, rof: 's/-/6', clip: 18, rld: 'FULL', type: EWeaponType.IMPACT, pen: 0, weight: 1.5 },
    [`Chaindagger`]: { name: 'Chaindagger', category: EItemCategory.WEAPON, count: 1, weaponCategory: EWeaponCategory.CHAIN, damage: '1d10+1', range: 0, rof: '', clip: 0, rld: '', type: EWeaponType.RENDING, pen: 0, weight: 1.5 },
}

export const allArmour: {[name: string]: IArmourItem} = {
    'DummyArmour': {
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



