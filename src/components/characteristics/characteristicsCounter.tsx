import { Badge, Col, Container, Row } from "react-bootstrap";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { decrement, decrementBonus, expMapCharacteristics, increment, incrementBonus, incrementFive } from './characteristicsSlice'
import { rollStatAndSendToDiscord } from "../character/Rolls";
import { FaDiceD20 } from "react-icons/all";
import { devotionMap, EGods } from "../talents/talentSlice";
import { addEntry } from "../character/experienceSlice";

export const CharacteristicsCounter = ({ short = '' }) => {
    const [hideBtns, toggleBtns] = React.useState(true);

    const characteristic = useAppSelector(state => state.characteristics[short]);
    const experience = useAppSelector(state => state.experience);
    const character = useAppSelector(state => state.character);
    const dispatch = useAppDispatch()


    function learnCharacteristics(short: string) {
        dispatch(incrementFive(characteristic.short));

        const characterDevotion = character.devotion ? character.devotion : EGods.UNALIGNED;
        const characteristicsDevotion = characteristic.devotion ? characteristic.devotion : EGods.UNALIGNED;

        const lv = experience.entries.reduce((sum, {
            type,
            description
        }) => description.includes(characteristic.name) && type === "CHAR" ? sum + 1 : sum, 0);

        const exp = expMapCharacteristics[devotionMap[characteristicsDevotion][characterDevotion]][Math.min(lv, 3)];
        dispatch(addEntry({ description: `${characteristic.name} Level ${lv}`, amount: -exp, type: "CHAR", devotion: characteristicsDevotion }))


    }

    return <Container id={`stat-${characteristic.name}`} style={{ backgroundColor: "lightgrey", padding: 0 }}>
        <Row onClick={() => toggleBtns(!hideBtns)}>
            <Col>
                <Badge variant="secondary" pill style={{ cursor: 'pointer' }}>
                    {characteristic.name}
                </Badge>
            </Col>
        </Row>
        <Row style={{ alignItems: 'stretch' }}>
            <Col>
                {!hideBtns
                    ? <>
                        <div>
                            <Badge variant={'success'} style={{ cursor: 'pointer' }}
                                   onClick={() => dispatch(incrementBonus(characteristic.short))}>+</Badge>
                            <Badge variant={'secondary'}>
                                {characteristic.bonus ? characteristic.bonus : 0}
                            </Badge>
                            <Badge variant={'danger'} style={{ cursor: 'pointer' }}
                                   onClick={() => dispatch(decrementBonus(characteristic.short))}>-</Badge>
                        </div>
                        <div>
                            <Badge pill variant={'success'} style={{ cursor: 'pointer' }}
                                   onClick={() => dispatch(increment(characteristic.short))}>+</Badge>
                            <Badge
                                variant={"dark"}
                                pill
                                onClick={() => toggleBtns(!hideBtns)}>
                                {characteristic.value}
                            </Badge>
                            <Badge pill variant={'danger'} style={{ cursor: 'pointer' }}
                                   onClick={() => dispatch(decrement(characteristic.short))}>-</Badge>

                        </div>
                        <div>
                            <Badge pill variant={"primary"}
                                   onClick={() => learnCharacteristics(characteristic.short)}
                            >Learn +5</Badge>
                        </div>
                    </>
                    : <>
                        <FaDiceD20
                            onClick={() => rollStatAndSendToDiscord(character.discord[character.discord.active], character.characterName, characteristic)}
                            color={"darkred"} style={{ cursor: "pointer" }}/>

                        {characteristic.bonus ?
                            <Badge variant={'secondary'}>
                                {characteristic.bonus}
                            </Badge>
                            : <></>}
                        <Badge
                            variant={"dark"}
                            pill
                            onClick={() => toggleBtns(!hideBtns)}>
                            {characteristic.value}
                        </Badge>
                    </>
                }

            </Col>
        </Row>
    </Container>;
}
