import { Button, Col, Container, FormControl, InputGroup, Row } from "react-bootstrap";
import { addTalent, ITalentState, removeTalent } from "./talentSlice";
import { Pencil, PlusCircle, Trash } from "react-bootstrap-icons";
import React, { useState } from "react";
import { TalentEntryFunction } from "./talentEntry";
import { useAppDispatch, useAppSelector } from "../../general/hooks";


export const TalentView = () => {
    const talents = useAppSelector(state => state.talents);
    const dispatch = useAppDispatch()

    const [newTalent, setNewTalent] = useState({name: '', description: '', tier: 0});

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h3>Talents</h3>
                </Col>
            </Row>
            <Row>
                {createTalentObject(talents)}
            </Row>
            <Row>
                <Col>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <Button
                                onClick={() => dispatch(addTalent(newTalent))}
                                variant="outline-primary">
                                { talents[newTalent.name] ? <Pencil/> : <PlusCircle/> }
                            </Button>
                        </InputGroup.Prepend>
                        <FormControl placeholder={'Talentname'} aria-describedby="basic-addon1"
                                     onChange={(event => setNewTalent({ ...newTalent, name: event.target.value }))} />
                        <FormControl placeholder={'Description'} aria-describedby="basic-addon1"
                                     onChange={(event => setNewTalent({
                                         ...newTalent,
                                         description: event.target.value
                                     }))} />
                         <InputGroup.Append>
                             <Button
                                 onClick={() => dispatch(removeTalent(newTalent))}
                                 variant="outline-primary"><Trash/></Button>
                         </InputGroup.Append>
                    </InputGroup>
                </Col>

            </Row>
        </Container>
    )
}

function createTalentObject(talents: ITalentState) {
    const result: JSX.Element[] = [];
    for (const name in talents) {
        result.push(
            <Col key={`talent-${name}`} style={{ padding: "5px" }}>
                <TalentEntryFunction {...talents[name]} />
            </Col>
        )
    }
    return result;
}
