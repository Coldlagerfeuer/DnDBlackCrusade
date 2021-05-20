import { Badge, Card, Col, Row } from "react-bootstrap";
import { editArmour } from "../inventory/inventorySlice";
import React from "react";
import { IArmourItem } from "./armourySlice";
import { useAppDispatch } from "../../general/hooks";


export const ArmourCard = ({ armour }: { armour: IArmourItem }) => {

    const dispatch = useAppDispatch()

    return <Card>
        <Card.Header>
            {armour.name}
        </Card.Header>
        <Card.Body>


            <Row>
                <Col>
                    <Row>
                        <Col>
                            Head:
                            <Badge variant={'success'} style={{ cursor: 'pointer' }}
                                   onClick={() => dispatch(editArmour({
                                       ...armour,
                                       head: armour.head ? armour.head + 1 : 1
                                   }))}>+</Badge>
                            <Badge pill={true} variant={"secondary"}>  {armour.head ? armour.head : 0} </Badge>
                            <Badge variant={'danger'} style={{ cursor: 'pointer' }} onClick={() => dispatch(editArmour({
                                ...armour, head: armour.head ? Math.max(armour.head - 1, 0) : 0
                            }))}>-</Badge>
                        </Col>

                    </Row>
                </Col>
                <Col md={2}/>
                <Col>

                    <Row>
                        <Col>
                            Body:

                            <Badge variant={'success'} style={{ cursor: 'pointer' }}
                                   onClick={() => dispatch(editArmour({
                                       ...armour,
                                       body: armour.body ? armour.body + 1 : 1
                                   }))}>+</Badge>
                            <Badge pill={true} variant={"secondary"}>  {armour.body ? armour.body : 0} </Badge>
                            <Badge variant={'danger'} style={{ cursor: 'pointer' }} onClick={() => dispatch(editArmour({
                                ...armour, body: armour.body ? Math.max(armour.body - 1, 0) : 0
                            }))}>-</Badge>
                        </Col>

                    </Row>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Row>
                        <Col>
                            Left:
                            <Badge variant={'success'} style={{ cursor: 'pointer' }}
                                   onClick={() => dispatch(editArmour({
                                       ...armour,
                                       armL: armour.armL ? armour.armL + 1 : 1
                                   }))}>+</Badge>
                            <Badge pill={true} variant={"secondary"}>  {armour.armL ? armour.armL : 0} </Badge>
                            <Badge variant={'danger'} style={{ cursor: 'pointer' }} onClick={() => dispatch(editArmour({
                                ...armour, armL: armour.armL ? Math.max(armour.armL - 1, 0) : 0
                            }))}>-</Badge>
                        </Col>

                    </Row>
                </Col>
                <Col md={2}>Arm</Col>
                <Col>

                    <Row>
                        <Col>
                            Right:

                            <Badge variant={'success'} style={{ cursor: 'pointer' }}
                                   onClick={() => dispatch(editArmour({
                                       ...armour,
                                       armR: armour.armR ? armour.armR + 1 : 1
                                   }))}>+</Badge>
                            <Badge pill={true} variant={"secondary"}>  {armour.armR ? armour.armR : 0} </Badge>
                            <Badge variant={'danger'} style={{ cursor: 'pointer' }} onClick={() => dispatch(editArmour({
                                ...armour, armR: armour.armR ? Math.max(armour.armR - 1, 0) : 0
                            }))}>-</Badge>
                        </Col>

                    </Row>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Row>
                        <Col>
                            Left:
                            <Badge variant={'success'} style={{ cursor: 'pointer' }}
                                   onClick={() => dispatch(editArmour({
                                       ...armour,
                                       legL: armour.legL ? armour.legL + 1 : 1
                                   }))}>+</Badge>
                            <Badge pill={true} variant={"secondary"}>  {armour.legL ? armour.legL : 0} </Badge>
                            <Badge variant={'danger'} style={{ cursor: 'pointer' }} onClick={() => dispatch(editArmour({
                                ...armour, legL: armour.legL ? Math.max(armour.legL - 1, 0) : 0
                            }))}>-</Badge>
                        </Col>

                    </Row>
                </Col>
                <Col md={2}>Leg</Col>
                <Col>

                    <Row>
                        <Col>
                            Right:

                            <Badge variant={'success'} style={{ cursor: 'pointer' }}
                                   onClick={() => dispatch(editArmour({
                                       ...armour,
                                       legR: armour.legR ? armour.legR + 1 : 1
                                   }))}>+</Badge>
                            <Badge pill={true} variant={"secondary"}>  {armour.legR ? armour.legR : 0} </Badge>
                            <Badge variant={'danger'} style={{ cursor: 'pointer' }} onClick={() => dispatch(editArmour({
                                ...armour, legR: armour.legR ? Math.max(armour.legR - 1, 0) : 0
                            }))}>-</Badge>
                        </Col>

                    </Row>
                </Col>
            </Row>

        </Card.Body>
    </Card>;
}
