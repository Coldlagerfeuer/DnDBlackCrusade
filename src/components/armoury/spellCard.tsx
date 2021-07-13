import { Badge, Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { ISpell } from "./armourySlice";
import { FaDiceD20, FcElectricity, GiArrowScope, GiShieldImpact, RiFocus3Line } from "react-icons/all";
import React from "react";
import { rollDamageAndSendToDiscord } from "../character/Rolls";
import { useAppSelector } from "../../general/hooks";


export const SpellCard = ({ spell }: { spell: ISpell }) => {

    const character = useAppSelector(state => state.character);

    return <Card>
        <Card.Header>
            <OverlayTrigger
                key={`spellCardTooltip-${spell.name}`}
                overlay={
                    <Tooltip
                        id={`tooltip-${spell.name}`}>{spell.description ? spell.description : "Add description"}</Tooltip>
                }>
                <div>
                    <FcElectricity/>{spell.name}
                </div>
            </OverlayTrigger>
        </Card.Header>
        <Card.Body>
            <Row>
                <Col>{spell.damage} <Badge pill={true} variant={"secondary"}> <GiShieldImpact/> {spell.pen} </Badge> </Col>
                <Col> <GiArrowScope/> {spell.range} </Col>
            </Row>
            <Row>
                <Col><RiFocus3Line/> {spell.focusPower}</Col>
                <Col>Sustained: {spell.sustained ? "Yes" : "No"}</Col>
            </Row>

            <Col>
                <Button size="sm" variant="light"
                        onClick={() => rollDamageAndSendToDiscord(character.discordServer, character.characterName, spell)}>
                    <FaDiceD20 color={"darkred"}
                               style={{ cursor: "pointer" }}
                    /> Damage
                </Button>
            </Col>

        </Card.Body>
    </Card>
}
