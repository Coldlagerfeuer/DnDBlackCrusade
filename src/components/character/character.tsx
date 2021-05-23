import React, { useState } from "react";
import { Button, Col, Container, Jumbotron, Row } from "react-bootstrap";
import { CharacteristicsCounter } from "../characteristics/characteristicsCounter";
import './character.scss';
import { SkillEntryFunction } from "../skills/skillEntry";
import { allSkills } from "./resources";
import {
    characteristicsInitialState,
    ICharacteristicsState,
    importCharacteristics
} from "../characteristics/characteristicsSlice";
import { importTalents } from "../talents/talentSlice";
import { InventoryFunction } from "../inventory/inventory";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { RootState } from "../../general/store";
import { importSkills } from "../skills/skillSlice";
import { importInventory } from "../inventory/inventorySlice";
import { TalentView } from "../talents/talentView";
import { Armoury } from "../armoury/armoury";
import { importArmoury } from "../armoury/armourySlice";
import { FileUploadDrop } from "./fileUploadDrop";


export const CharacterFunction = () => {
    const [skillCols, setSkillCols] = useState(2);
    const [mainCols, setMainCols] = useState(1);
    const [showType, toggleShowType] = useState(true);
    const [showSkilled, toggleShowSkilled] = useState(false);
    const [importState, setImportState] = useState('');

    const completeState = useAppSelector(state => state);
    const dispatch = useAppDispatch()

    function importStateFromJson(importState: string) {
        if (!importState) {
            return;
        }
        const state = JSON.parse(importState) as RootState;
        dispatch(importCharacteristics(state.characteristics))
        dispatch(importInventory(state.inventory))
        dispatch(importSkills(state.skills))
        dispatch(importTalents(state.talents))
        dispatch(importArmoury(state.armoury))
    }

    function getCharacteristicsPane() {
        return <Jumbotron key={"jumbo-characteristics"}>
            <Container style={{ padding: 0 }}>
                <Row>
                    <Col>
                        <h3>Characteristics</h3>
                    </Col>
                </Row>
                <Row>
                    {createCharacteristicsObjects(characteristicsInitialState)}
                </Row>
            </Container>
        </Jumbotron>
    }

    function getSkillsPane() {
        return <Jumbotron key={"jumbo-skills"}>
            <Row>
                <Col>
                    <h3>Skills</h3>
                </Col>
            </Row>
            <Row>Col: {skillCols}
                <Button style={{ padding: 0, width: '10px', height: '25px' }} variant="outline-secondary" size="sm"
                        onClick={() => setSkillCols(skillCols - 1)}>-</Button>
                <Button style={{ padding: 0, width: '10px', height: '25px' }} variant="outline-secondary" size="sm"
                        onClick={() => setSkillCols(skillCols + 1)}>+</Button>
                <Button size={"sm"} style={{ padding: 0, height: '25px' }}
                        onClick={() => toggleShowType(!showType)}>Type</Button>
                <Button size={"sm"} style={{ padding: 0, height: '25px' }}
                        onClick={() => toggleShowSkilled(!showSkilled)}>Skilled</Button>
            </Row>
            <Container fluid>
                <Row>
                    {createSkillMatrix(skillCols, showType, showSkilled).map((skillCols, index) => (
                        <Col key={`skillcol-${index}`}>
                            <Col>
                                <Container>
                                    <Row>
                                        <Col md={5}><b>Skillname</b></Col>
                                        <Col md={4}>
                                            <span style={{ paddingLeft: 12, paddingRight: 12 }}><b>T</b></span>
                                            <span style={{ paddingLeft: 5, paddingRight: 5 }}><b>+10</b></span>
                                            <span style={{ paddingLeft: 5, paddingRight: 5 }}><b>+20</b></span>
                                            <span style={{ paddingLeft: 5, paddingRight: 5 }}><b>+30</b></span>
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                            {skillCols}
                        </Col>
                    ))}
                </Row>
            </Container>
        </Jumbotron>
    }

    function getTalentsPane() {
        return <Jumbotron key={"jumbo-talents"}>
            <TalentView/>
        </Jumbotron>
    }

    function getInventoryPane() {
        return <Jumbotron key={"jumbo-inventory"}>
            <Row>
                <Col>
                    <h3>Inventory</h3>
                </Col>
            </Row>
            <InventoryFunction/>
        </Jumbotron>
    }

    function getArmouryPane() {
        return <Jumbotron key={"jumbo-armoury"}>
            <Armoury/>
        </Jumbotron>
    }

    function getSettingsPane() {

        return <Jumbotron key={"jumbo-settings"}>
            <Container>
                <Row>
                    <Col>
                        <h3>Settings</h3>
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <Row>
                            <Col>
                                <Button size={"sm"}
                                        onClick={() => setImportState(JSON.stringify(completeState))}>Export</Button>

                            </Col>
                            <Col>
                                <Button size={"sm"} onClick={() => importStateFromJson(importState)}>Load</Button>

                            </Col>

                        </Row>
                        <Row>
                            <Col>

                                <a href={`data:text/json;charset=utf-8,${encodeURIComponent(
                                    JSON.stringify(completeState)
                                )}`} download={"DnD-Character.json"}>

                                    <Button size={"sm"}>Download</Button>
                                </a>
                            </Col>
                            <Col>
                                {/*<input type="file" />*/}
                                {/*<FileUploadDrop />*/}
                            </Col>
                        </Row>
                        <Row>
                            Cols: {mainCols}
                            <Button style={{ padding: 0, width: '10px', height: '25px' }} variant="outline-secondary"
                                    size="sm"
                                    onClick={() => setMainCols(mainCols - 1)}>-</Button>
                            <Button style={{ padding: 0, width: '10px', height: '25px' }} variant="outline-secondary"
                                    size="sm"
                                    onClick={() => setMainCols(mainCols + 1)}>+</Button>

                        </Row>
                    </Col>
                    <Col sm={10}>
                        <FileUploadDrop {...{ importState, setImportState }} />
                    </Col>
                </Row>
            </Container>
        </Jumbotron>
    }

    const allPanes = [
        getCharacteristicsPane(),
        getSkillsPane(),
        getTalentsPane(),
        getArmouryPane(),
        getInventoryPane(),
        getSettingsPane(),
    ]

    return <>
        {mainCols === 1
            ? <Container>
                {mapElements(allPanes, mainCols)}
            </Container>
            : <Row>
                {mapElements(allPanes, mainCols).map((elementCol, index) => (
                    <Col key={`skillcol-${index}`}>
                        {elementCol}
                    </Col>
                ))}
            </Row>
        }</>
}


function createCharacteristicsObjects(characteristics: ICharacteristicsState): JSX.Element[] {
    const result: JSX.Element[] = [];
    for (const short in characteristics) {
        result.push(
            <Col key={`stat-${short}`} style={{ padding: "5px" }}>
                <CharacteristicsCounter short={short}/>
            </Col>
        )
    }
    return result;
}

function createSkillMatrix(colCount: number = 2, showType: boolean, showSkilled: boolean) {
    const skillObjects: JSX.Element[] = [];
    for (const skillName in allSkills) {
        skillObjects.push(
            // <></>
            <SkillEntryFunction key={`skill-${skillName}`}  {...{skillName, showType, showSkilled }} />
        )
    }

    return mapElements(skillObjects, colCount);
}

function mapElements(objects: JSX.Element[], colCount: number) {
    const matrix: any[] = [];
    for (let j = 0; j < colCount; j++) {
        const part = ((objects.length - 1) / colCount + 1 | 0);
        matrix[j] = new Array(part);
        for (let i = part * j; i < part * (j + 1); i++) {
            matrix[j].push(objects[i]);
        }
    }
    return matrix;
}