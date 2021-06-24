import { Badge, Col, Container, Row } from "react-bootstrap";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { decrement, decrementBonus, increment, incrementBonus } from './characteristicsSlice'
import { rollStatAndSendToDiscord } from "../character/Rolls";
import { FaDiceD20 } from "react-icons/all";

export const CharacteristicsCounter = ({ short = '' }) => {
    const [hideBtns, toggleBtns] = React.useState(true);

    const characteristic = useAppSelector(state => state.characteristics[short]);
    const character = useAppSelector(state => state.character);
    const dispatch = useAppDispatch()


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
                    </>
                    : <>
                        <FaDiceD20 onClick={() => rollStatAndSendToDiscord(character.discordServer, character.characterName, characteristic)} color={"darkred"} style={{ cursor: "pointer" }}/>

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
