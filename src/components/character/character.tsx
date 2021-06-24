import React, { useState } from "react";
import { Button, Col, Container, Form, FormControl, FormGroup, FormLabel, Jumbotron, Row } from "react-bootstrap";
import { CharacteristicsCounter } from "../characteristics/characteristicsCounter";
import './character.scss';
import { SkillEntryFunction } from "../skills/skillEntry";
import { allArmour, allItems, allWeapons } from "./resources";
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
import { IInventory, IItem, importInventory } from "../inventory/inventorySlice";
import { TalentView } from "../talents/talentView";
import { Armoury } from "../armoury/armoury";
import { IArmour, importArmoury, IWeapon, IWeaponState } from "../armoury/armourySlice";
import { FileUploadDrop } from "./fileUploadDrop";
import { setCharacterName, setDiscordServer } from "./characterSlice";
import { rollAndSendToDiscord, rollTestAndSendToDiscord } from "./Rolls";
import { FaDiceD20 } from "react-icons/all";
import { EItemCategory } from "./EItemCategory";


export const CharacterFunction = () => {
    const [skillCols, setSkillCols] = useState(2);
    const [mainCols, setMainCols] = useState(1);
    const [showType, toggleShowType] = useState(true);
    const [showSkilled, toggleShowSkilled] = useState(false);
    const [importState, setImportState] = useState('');
    const [editCharacterName, setEditCharacterName] = useState(false);
    const [editDiscord, setEditDiscord] = useState(false);
    const [customAmount, setCustomAmount] = useState(1)
    const [customLimit, setCustomLimit] = useState(100)


    const completeState = useAppSelector(state => state);
    const dispatch = useAppDispatch()

    function importStateFromJson(importState: string) {
        if (!importState) {
            return;
        }
        const state = JSON.parse(importState) as RootState;
        dispatch(setCharacterName(state.character.characterName))
        dispatch(setDiscordServer(state.character.discordServer))
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
                        {editCharacterName ?
                            <FormControl
                                onMouseLeave={() => setEditCharacterName(false)}
                                value={completeState.character.characterName}
                                onChange={(event => dispatch(setCharacterName(event.target.value)))}
                                autoFocus={true}/>
                            :
                            <h1 style={{ fontFamily: 'CloisterBlack', fontSize: "xxx-large" }}
                                onClick={() => setEditCharacterName(true)}
                            >{completeState.character.characterName}</h1>
                        }
                    </Col>
                </Row>
                <Row>
                    {createCharacteristicsObjects(characteristicsInitialState)}
                </Row>
                <Row>

                    <Form>
                        <Form.Row>

                            <Col md={3}>
                                <h3>Custom Roll:</h3>
                            </Col>

                            <Col md={3}>

                                <FormGroup as={Row}>
                                    <FormLabel column md={4}>Amount</FormLabel>
                                    <Col md={8}>
                                        <FormControl size={"sm"} value={customAmount}
                                                     onChange={event => setCustomAmount(parseInt(event.target.value))}/>
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col>d</Col>
                            <Col md={3}>

                                <FormGroup as={Row}>
                                    <FormLabel column md={4}>Limit</FormLabel>
                                    <Col md={8}>
                                        <FormControl size={"sm"} value={customLimit}
                                                     onChange={event => setCustomLimit(parseInt(event.target.value))}/>
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col>
                                <Button
                                    onClick={() => rollAndSendToDiscord(completeState.character.discordServer, completeState.character.characterName, customAmount, customLimit)}
                                    variant={"light"}> Roll <FaDiceD20 color={"darkred"} style={{ cursor: "pointer" }}/>
                                </Button>
                            </Col>
                        </Form.Row>
                    </Form>
                </Row>
            </Container>
        </Jumbotron>
    }

    function getSkillsPane() {

        function createSkillMatrix(colCount: number = 2, showType: boolean, showSkilled: boolean, callbackRoll: any) {
            const skillObjects: JSX.Element[] = [];
            const skillNames: string[] = showSkilled ? Object.values(completeState.skills).filter(value => value.level > 0).map(skill => skill.parent ? `${skill.parent.name} - ${skill.name}` : skill.name) : Object.keys(completeState.skills);
            skillNames.sort((a, b) => a.localeCompare(b))

            skillNames.forEach(skillName => {
                skillObjects.push(
                    <SkillEntryFunction key={`skill-${skillName}`}  {...{
                        skillName,
                        showType,
                        showSkilled,
                        callbackRoll
                    }} />
                )
            });
            return mapElements(skillObjects, colCount);
        }


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
                    {createSkillMatrix(skillCols, showType, showSkilled, rollTestAndSendToDiscord).map((skillCols, index) => (
                        <Col key={`skillcol-${index}`}>
                            <Col>
                                {showSkilled ? <Row>
                                        <Col md={1}>{/* EMPTY */}</Col>
                                        <Col md={5}><b>Skillname</b></Col>
                                        <Col>T</Col>
                                        <Col>C</Col>
                                        <Col>B</Col>
                                        <Col><b>Sum</b></Col>
                                    </Row>
                                    : <Row>
                                        <Col md={5}><b>Skillname</b></Col>
                                        <Col md={5} style={{ padding: 0 }}>
                                            <span style={{ paddingLeft: 0, paddingRight: 12 }}><b>T</b></span>
                                            <span style={{ paddingLeft: 5, paddingRight: 5 }}><b>+10</b></span>
                                            <span style={{ paddingLeft: 5, paddingRight: 5 }}><b>+20</b></span>
                                            <span style={{ paddingLeft: 5, paddingRight: 5 }}><b>+30</b></span>
                                        </Col>
                                        <Col md={2}>Bonus</Col>
                                    </Row>
                                }
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

        function calcNewItems() {
            const result = {
                items: {},
                weapons: {},
                armour: {}
            }

            const items: IInventory = {};
            const weapons: IWeaponState = {};
            const armour: { [name: string]: IArmour } = {};

            const inventory = completeState.inventory;
            for (const itemName in inventory) {
                if (!(itemName in allItems || itemName in allWeapons || itemName in allArmour)) {
                    const item: IItem = inventory[itemName];
                    if (item.category === EItemCategory.WEAPON) {
                        weapons[itemName] = item as IWeapon;
                    } else if (item.category === EItemCategory.ARMOUR) {
                        armour[itemName] = item as IArmour;
                    } else {
                        items[itemName] = item;
                    }
                }
            }
            result.items = items;
            result.weapons = weapons;
            result.armour = armour;
            return result
        }

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
                                )}`} download={completeState.character.characterName ? completeState.character.characterName + ".json" : "DnD-Character.json"}>
                                    <Button>Download</Button>
                                </a>
                            </Col>
                            <Col>

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
                        <Row>
                            <Col>
                                <Button onClick={() => setImportState(JSON.stringify(calcNewItems()))}>Export New
                                    Items</Button>
                            </Col>
                        </Row>
                    </Col>

                    <Col sm={10}>
                        <FileUploadDrop {...{ importState, setImportState }} />
                    </Col>
                </Row>

                <Row>
                    {editDiscord ?
                        <FormControl
                            onMouseLeave={() => setEditDiscord(false)}
                            value={completeState.character.discordServer}
                            onChange={(event => dispatch(setDiscordServer(event.target.value)))}
                            autoFocus={true}/>
                        :
                        <h4
                            onClick={() => setEditDiscord(true)}
                        >{completeState.character.discordServer ? completeState.character.discordServer : 'Click to set Discord'}</h4>
                    }
                </Row>

            </Container>
        </Jumbotron>
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function getDebugPane() {
        if (process.env.NODE_ENV === 'development') {
            return <Jumbotron key={'debugPane'}>
                {editDiscord ?
                    <FormControl
                        onMouseLeave={() => setEditDiscord(false)}
                        value={completeState.character.discordServer}
                        onChange={(event => dispatch(setDiscordServer(event.target.value)))}
                        autoFocus={true}/>
                    :
                    <h4
                        onClick={() => setEditDiscord(true)}
                    >{completeState.character.discordServer ? completeState.character.discordServer : 'Click to set Discord'}</h4>
                }
                {/*<Button onClick={() => sendMessageToDiscord('TEST')}>Send Discord Message</Button>*/}
            </Jumbotron>
        }
        return <div key={'debugPane'}/>;
    }


    const allPanes = [

        // getDebugPane(),

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
                    <Col key={`skillcol-${index}`} md={6}>
                        {elementCol}
                    </Col>
                ))}
            </Row>
        }</>


} // END OF FUNCTION


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
