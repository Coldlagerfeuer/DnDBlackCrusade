import { ISkill } from "../skills/skillSlice";
import { EDamageType, IWeapon } from "../armoury/armourySlice";
import { ICharacteristics } from "../characteristics/characteristicsSlice";
import { getHitLocation, reverseNumber } from "../armoury/armoury";

enum ERollType {
    NONE,
    TEST,
    STAT,
    INIT,
    DAMAGE
}

export interface IRollResult {
    rollType: ERollType,
    rolls: number[],
    rollSum: number,
    amount: number,
    limit: number,
}

export interface IStatRoll extends IRollResult {
    characteristics: ICharacteristics,
    modifier: number,
    result?: boolean,
}

export interface ITestRoll extends IRollResult {
    stat?: number,
    level?: number,
    sum?: number,
    result?: boolean,
}

export interface IDamageRoll extends IRollResult {
    damage: number,
    type: EDamageType,
    pen: number,

}

export interface IInitRoll extends IRollResult {
    bonus: number,
}

export function rollTestAndSendToDiscord(discordServer: string, username: string, characteristics: number, skill?: ISkill, amount: number = 1, limit: number = 100, bonus: number = 0): IRollResult {
    const rollResult = rollTest(characteristics, amount, limit, bonus, skill);
    const message = skill ? `tried ${skill.name} Test` : ""

    sendMessage(discordServer, message, getEmbedsForRollType(rollResult), username);

    return rollResult
}

export function rollAndSendToDiscord(discordServer: string, username: string, amount: number = 1, limit: number = 100) {
    const rollResult = roll(amount, limit);
    sendMessage(discordServer, ` made custom roll`, getEmbedsForRollType(rollResult), username);
    return rollResult;
}

export function rollDamageAndSendToDiscord(discordServer: string, username: string, weapon: IWeapon): IRollResult {

    // Damage Calc
    const d = weapon.damage.split("d")
    const amount = parseInt(d[0]);
    const limit = parseInt(d[1].split("+")[0]);
    const damage = parseInt(d[1].split("+")[1]);

    const rollResult: IDamageRoll = { ...roll(amount, limit), rollType: ERollType.DAMAGE, ...weapon, damage };

    sendMessage(discordServer, `attacks with ${weapon.name} `, getEmbedsForRollType(rollResult), username);

    return rollResult
}

export function rollInitAndSendToDiscord(discordServer: string, username: string, bonus: number, amount: number = 1, limit: number = 100): IRollResult {
    const rollResult: IInitRoll = { ...roll(amount, limit), rollType: ERollType.INIT, bonus };

    sendMessage(discordServer, "rolled Init", getEmbedsForRollType(rollResult), username);

    return rollResult
}

export function rollStatAndSendToDiscord(discordServer: string, username: string, characteristics: ICharacteristics, modifier: number = 0, amount: number = 1, limit: number = 100): IRollResult {
    const rollResult: IStatRoll = { ...roll(amount, limit), rollType: ERollType.STAT, characteristics, modifier };
    rollResult.result = rollResult.rollSum < characteristics.value + rollResult.modifier;

    sendMessage(discordServer, `rolled for ${characteristics.name}`, getEmbedsForRollType(rollResult), username);

    return rollResult
}


function getEmbedsForRollType(roll: IRollResult) {
    const colorCodeRed = 14159922;
    const colorCodeGreen = 4113681;

    switch (roll.rollType) {
        case ERollType.NONE: {
            const rollResult = roll
            return [{
                fields: [
                    { name: "Roll", value: `${rollResult.amount}d${rollResult.limit}`, inline: true },
                    { name: "Results", value: `${rollResult.rolls}`, inline: true },
                    { name: "Sum", value: `${rollResult.rollSum}`, inline: true },
                ]
            }]
        }
        case ERollType.INIT: {
            const rollResult = roll as IInitRoll
            return [{
                fields: [
                    { name: "Roll", value: `${rollResult.amount}d${rollResult.limit}`, inline: true },
                    { name: "Roll", value: `${rollResult.rolls}`, inline: true },
                    {
                        name: "Sum",
                        value: `${rollResult.rollSum} ${rollResult.bonus < 0 ? rollResult.bonus : `+ ${rollResult.bonus}`} = **${rollResult.rollSum + rollResult.bonus}**`, inline: true},
                ]
            }]
        }
        case ERollType.TEST: {
            const rollResult = roll as ITestRoll;
            const r = rollResult.result ? '>' : '<';
            return [
                {
                    color: rollResult.result ? colorCodeGreen : colorCodeRed,
                    // description: JSON.stringify(rollResult),
                    fields: [
                        { name: "Roll", value: `${rollResult.amount}
                        d${ rollResult.limit }`, inline: true },
                        { name: "Results", value: `${rollResult.rolls}`, inline: true },
                        { name: "Sum", value: `${rollResult.rollSum}`, inline: true },
                        { name: "Stat", value: `${rollResult.stat}`, inline: true },
                        { name: "Level", value: `${rollResult.level}`, inline: true },
                        { name: "Sum", value: `${rollResult.sum}`, inline: true },
                        {
                            name: "**Result**",
                            value: `${rollResult.sum} ${r} ${rollResult.rollSum} = ${rollResult.result ? '**SUCCESS**' : '**FAILURE**'}`
                        },

                    ],
                },
            ]
        }
        case ERollType.DAMAGE: {
            const rollResult = roll as IDamageRoll
            return [
                {
                    fields: [
                        { name: "Roll", value: `${rollResult.amount}
                        d${ rollResult.limit }`, inline: true },
                        { name: "Results", value: `${rollResult.rolls}`, inline: true },
                        { name: "Damage", value: `${rollResult.damage}`, inline: true },
                        { name: "Sum", value: ` **${rollResult.rollSum + rollResult.damage}
                        *
                        *`, inline: true },
                        { name: "Pen", value: `${rollResult.pen}`, inline: true },
                        { name: "Type", value: `${EDamageType[rollResult.type]}`, inline: true },
                    ]
                }
            ]
        }
        case ERollType.STAT: {
            const rollResult = roll as IStatRoll
            const r = rollResult.result ? '>' : '<';
            return [{
                color: rollResult.result ? colorCodeGreen : colorCodeRed,
                fields: [
                    { name: "Roll", value: `${rollResult.amount}
                        d${ rollResult.limit }`, inline: true },
                    { name: "Sum", value: `${rollResult.rollSum}`, inline: true },
                    {
                        name: "Stat",
                        value: `${rollResult.characteristics.value} ${rollResult.modifier < 0 ? rollResult.modifier : `+${rollResult.modifier}`}`,
                        inline: true
                    },
                    {
                        name: "**Result**",
                        value: `${rollResult.characteristics.value + rollResult.modifier} ${r} ${rollResult.rollSum} = ${rollResult.result ? '**HIT**' : '**MISSED**'}`
                    },
                    { name: "Hit Location", value: `${getHitLocation(rollResult.rollSum)}` },
                ]
            }]
        }
    }
}


function sendMessage(discord: string, message: string, embeds: any, username?: string) {
    fetch(discord,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({

                username: username,
                content: message,
                embeds: embeds

            })
        });

}

export function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roll(amount: number, limit: number): IRollResult {
    const rollResult: ITestRoll = { rollType: ERollType.NONE, rolls: [], rollSum: 0, amount, limit };
    for (let count = 0; count < rollResult.amount; count++) {
        const roll = getRndInteger(0, rollResult.limit);
        rollResult.rolls[count] = roll;
        rollResult.rollSum += roll;
    }
    return rollResult
}


function rollTest(characteristics: number, amount: number, limit: number, bonus: number, skill?: ISkill): IRollResult {
    const rollResult: ITestRoll = roll(amount, limit);
    rollResult.rollType = ERollType.TEST

    rollResult.stat = characteristics + bonus + (skill?.bonus ? skill?.bonus : 0);
    rollResult.level = skill ? (skill.level === 0 ? -20 : (skill.level - 1) * 10) : 0
    rollResult.sum = rollResult.level + rollResult.stat;
    rollResult.result = rollResult.rollSum - rollResult.sum < 0

    return rollResult
}


