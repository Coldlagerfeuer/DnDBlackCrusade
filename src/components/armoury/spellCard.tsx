import { Badge, Card, Col, Row } from "react-bootstrap";
import { ISpell } from "./armourySlice";
import { FcElectricity, GiArrowScope, GiShieldImpact, RiFocus3Line } from "react-icons/all";
import React from "react";


export const SpellCard = ({ spell }: { spell: ISpell }) => {


    return <Card>
        <Card.Header>
            <FcElectricity />{spell.name}
        </Card.Header>
        <Card.Body>
            <Row>
                <Col >{spell.damage} <Badge pill={true} variant={"secondary"}> <GiShieldImpact/> {spell.pen} </Badge> </Col>
                <Col> <GiArrowScope/> {spell.range} </Col>
                {/*<Col></Col>*/}
            </Row>
            <Row>
                <Col><RiFocus3Line /> {spell.focusPower}</Col>
                <Col>Sustained: {spell.sustained ? "Yes" : "No"}</Col>
            </Row>

        </Card.Body>
    </Card>
}
