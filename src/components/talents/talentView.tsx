import {
    Button,
    Col,
    Container,
    Dropdown,
    DropdownButton,
    FormControl,
    InputGroup,
    ListGroup,
    Row
} from "react-bootstrap";
import { addTalent, ITalent, ITalentState, removeTalent } from "./talentSlice";
import { Pencil, PlusCircle, Trash } from "react-bootstrap-icons";
import React, { useState } from "react";
import { TalentEntryFunction } from "./talentEntry";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { Typeahead } from "react-bootstrap-typeahead";
import { allTalents } from "../character/resources";

export const TalentView = () => {
    const talents = useAppSelector(state => state.talents);
    const dispatch = useAppDispatch()

    const [activeTalent, setActiveTalent] = useState({ name: '', description: '', tier: 0 } as ITalent);

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
                {createTalentObject(talents, setActiveTalent)}
            </Row>
            <Row>
                <Col>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <Button
                                onClick={() => dispatch(addTalent(activeTalent))}
                                variant="outline-primary">
                                {talents[activeTalent.name] ? <Pencil/> : <PlusCircle/>}
                            </Button>
                        </InputGroup.Prepend>
                        <Typeahead
                            placeholder={'Talentname'}
                            id="basic-typeahead-talents"
                            options={talentOptions}
                            paginationText={"More..."}
                            size={"large"}
                            onInputChange={(name) => setActiveTalent({ ...activeTalent, name: name })}
                            onChange={(selection) => setActiveTalent({
                                ...activeTalent, ...allTalents[selection[0]?.toString()],
                                name: selection[0]?.toString()
                            })}
                            selected={allTalents[activeTalent.name] ? [activeTalent.name] : [activeTalent.name]}
                        />
                        <FormControl placeholder={"Specialization or count"}
                                     value={activeTalent.specialization ? activeTalent.specialization : ""}
                                     size={"lg"}
                                     onChange={(event => setActiveTalent({
                                         ...activeTalent,
                                         specialization: event.target.value
                                     }))}
                        />
                        <DropdownButton size={"lg"} variant="success" title={`Tier: ${activeTalent.tier}`}>
                            <Dropdown.Item
                                onClick={() => setActiveTalent({ ...activeTalent, tier: 1 })}>1</Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => setActiveTalent({ ...activeTalent, tier: 2 })}>2</Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => setActiveTalent({ ...activeTalent, tier: 3 })}>3</Dropdown.Item>
                        </DropdownButton>
                        <InputGroup.Append>
                            <Button
                                onClick={() => dispatch(removeTalent(activeTalent))}
                                variant="outline-primary"><Trash/></Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col md={8}>

                    <FormControl placeholder={'Description'} aria-describedby="basic-addon1"
                                 as="textarea" size={"sm"} rows={10}
                                 value={activeTalent.description}
                                 onChange={(event => setActiveTalent({
                                     ...activeTalent,
                                     description: event.target.value
                                 }))}/>
                </Col>
                <Col>
                    Prerequisites to Skill
                    <ListGroup>
                        {activeTalent.prerequisites?.split(",").map((prerequisit: string) =>
                            <ListGroup.Item key={`prerequisit-${prerequisit}`}>{prerequisit}</ListGroup.Item>
                        )}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}


function createTalentObject(talents: ITalentState, setNewTalent: React.Dispatch<React.SetStateAction<ITalent>>) {
    const result: JSX.Element[] = [];
    for (const name in talents) {
        result.push(
            <Col key={`talent-${name}`} style={{ padding: "5px" }}>
                <TalentEntryFunction {...talents[name]} setActiveTalent={setNewTalent}/>
            </Col>
        )
    }
    return result;
}
