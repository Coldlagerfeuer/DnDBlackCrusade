import { Button, Col, Container, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import { addTalent, ITalent, ITalentState, removeTalent } from "./talentSlice";
import { Pencil, PlusCircle, Trash } from "react-bootstrap-icons";
import React, { useState } from "react";
import { TalentEntryFunction } from "./talentEntry";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { Hint, Typeahead } from "react-bootstrap-typeahead";
import { allItems, allTalents } from "../character/resources";

export const TalentView = () => {
    const talents = useAppSelector(state => state.talents);
    const dispatch = useAppDispatch()

    const [newTalent, setNewTalent] = useState({ name: '', description: '', tier: 0, prerequisites: "" } as ITalent);

    const talentOptions = [];
    for (const talent in allTalents) {
        talentOptions.push(talent);
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h3>Talents</h3>
                </Col>
            </Row>
            <Row>
                {createTalentObject(talents, setNewTalent)}
            </Row>
            <Row>
                <Col>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <Button
                                onClick={() => dispatch(addTalent(newTalent))}
                                variant="outline-primary">
                                {talents[newTalent.name] ? <Pencil/> : <PlusCircle/>}
                            </Button>
                        </InputGroup.Prepend>
                        {/*<FormControl placeholder={'Talentname'} aria-describedby="basic-addon1"*/}
                        {/*             onChange={(event => setNewTalent({ ...newTalent, name: event.target.value }))} />*/}

                        <Typeahead
                            placeholder={'Talentname'}
                            id="basic-typeahead-talents"
                            options={talentOptions}
                            onInputChange={(name) => setNewTalent({ ...newTalent, name: name })}
                            onChange={(selection) => setNewTalent({ ...newTalent, ...allTalents[selection[0]?.toString()],   name: selection[0]?.toString() })}
                            selected={allTalents[newTalent.name] ? [newTalent.name] : []}
                        />

                        <FormControl placeholder={'Description'} aria-describedby="basic-addon1"
                                     onChange={(event => setNewTalent({
                                         ...newTalent,
                                         description: event.target.value
                                     }))}/>
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


function createTalentObject(talents: ITalentState, setNewTalent: React.Dispatch<React.SetStateAction<ITalent>> ) {
    const result: JSX.Element[] = [];
    for (const name in talents) {
        result.push(
            <Col key={`talent-${name}`} style={{ padding: "5px" }}>
                <TalentEntryFunction { ...talents[name]}  setActiveTalent={setNewTalent} />
            </Col>
        )
    }
    return result;
}
