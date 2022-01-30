import { Badge, Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { ISpell, removeWeapon } from "./armourySlice";
import { FaDiceD20, FcElectricity, GiArrowScope, GiShieldImpact, RiFocus3Line } from "react-icons/all";
import React from "react";
import { rollDamageAndSendToDiscord } from "../character/Rolls";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { addItem } from "../inventory/inventorySlice";


export const SpellCard = ({ spell }: { spell: ISpell }) => {
    const dispatch = useAppDispatch();

    const character = useAppSelector(state => state.character);

    const { name, damage} = spell

    const equipped = useAppSelector(state => state.armoury.weapons[name]);


    function getRemoveFromArmoury() {
        return equipped ?
            <Col md={1}>
                <Badge variant={'danger'} style={{ cursor: 'pointer' }}
                       onClick={() => {
                           dispatch(removeWeapon(spell));
                           dispatch(addItem(spell))
                       }}>-
                </Badge>
            </Col> : <></>
    }


    function getNameField() {
        return <OverlayTrigger
            key={`spellCardTooltip-${spell.name}`}
            overlay={
                <Tooltip
                    id={`tooltip-${spell.name}`}>{spell.description ? spell.description : "Add description"}</Tooltip>
            }>
            <div>
                <FcElectricity/>{spell.name}
            </div>
        </OverlayTrigger>;
    }

    function getDamageField() {
        return <Row>
            <Col>{spell.damage} <Badge pill={true} variant={"secondary"}> <GiShieldImpact/> {spell.pen} </Badge> </Col>
            <Col> <GiArrowScope/> {spell.range} </Col>
        </Row>;
    }

    function getFocusPowerField() {
        return <Row>
            <Col><RiFocus3Line/> {spell.focusPower}</Col>
            <Col>Sustained: {spell.sustained ? "Yes" : "No"}</Col>
        </Row>;
    }

    return <Card>
        <Card.Header>
            {getNameField()}
            {getDamageField()}
            {getRemoveFromArmoury()}
        </Card.Header>
        <Card.Body>
            {getFocusPowerField()}

            <Col>
                <Button size="sm" variant="light"
                        onClick={() => rollDamageAndSendToDiscord(character.discord[character.discord.active], character.characterName, spell)}>
                    <FaDiceD20 color={"darkred"}
                               style={{ cursor: "pointer" }}
                    /> Damage
                </Button>
            </Col>

        </Card.Body>
    </Card>
}
