import { Button, Col, Container, Dropdown, DropdownButton, FormControl, InputGroup, ListGroup, Row } from "react-bootstrap";
import { addTalent, devotionMap, EGods, expMap, ITalent, ITalentState, removeTalent } from "./talentSlice";
import { Pencil, PlusCircle, Trash } from "react-bootstrap-icons";
import React, { useState } from "react";
import { TalentEntryFunction } from "./talentEntry";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { Typeahead } from "react-bootstrap-typeahead";
import { allTalents } from "../character/resources";


export const TalentView = ({ sidebar = false }) => {
    const talents = useAppSelector(state => state.talents);
    const devotion = useAppSelector(state => state.character.devotion)
    const dispatch = useAppDispatch()

    const [activeTalent, setActiveTalent] = useState({ name: '', description: '', tier: 0 } as ITalent);

    const talentOptions: any[] = [];
    for (const talent in allTalents) {
        talentOptions.push(talent);
    }

    function getEditFields() {
        return (<div>
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
                            selected={allTalents[activeTalent.name] ? [activeTalent.name] : []}
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
                        {activeTalent.tier !== 0 ? <ListGroup.Item>Needed Exp: {calcNeededExp(activeTalent, devotion)} </ListGroup.Item>
                            : <></> // => Traits do not have exp
                        }
                    </ListGroup>
                    Alignment: {activeTalent.devotion}
                </Col>
            </Row>
        </div>);
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h3>Talents & Traits</h3>
                </Col>
            </Row>
            {sidebar ? createSimpleTalent(talents, setActiveTalent) : getEditFields()}

        </Container>
    )
}


function calcNeededExp(activeTalent: ITalent, devotion?: EGods): number {
    const characterDevotion = devotion ? devotion : EGods.UNALIGNED;
    const talentDevotion = activeTalent.devotion ? activeTalent.devotion : EGods.UNALIGNED;

    return expMap[activeTalent.tier - 1][devotionMap[talentDevotion][characterDevotion]];
}

function createSimpleTalent(talents: ITalentState, setNewTalent: React.Dispatch<React.SetStateAction<ITalent>>) {
    return <Row>{Object.keys(talents).map(value => <TalentEntryFunction key={`talent-entry-${value}`} {...talents[value]}
                                                                        setActiveTalent={setNewTalent}/>)}</Row>
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
