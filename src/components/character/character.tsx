import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormControl, FormGroup, FormLabel, Jumbotron, Row } from "react-bootstrap";
import { CharacteristicsCounter } from "../characteristics/characteristicsCounter";
import './character.scss';
import { allArmour, allItems, allWeapons } from "./resources";
import { characteristicsInitialState, ICharacteristicsState, importCharacteristics } from "../characteristics/characteristicsSlice";
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
import { changeLayout, importCharacter, setCharacterName, setDiscordActive, setDiscordServer, setDiscordServerDebug } from "./characterSlice";
import { rollAndSendToDiscord } from "./Rolls";
import { FaDiceD20 } from "react-icons/all";
import { EItemCategory } from "./EItemCategory";
import { SkillView } from "../skills/skillView";
import { ETabNames } from "./ETabNames";
import { ExperienceView } from "./experienceView";
import { SearchView } from "../search/searchView";
import { importExperience } from "./experienceSlice";


export const CharacterFunction = ({ isMobile }: { isMobile: boolean }) => {
    const [mainCols, setMainCols] = useState(1);
    const [importState, setImportState] = useState('');
    const [editCharacterName, setEditCharacterName] = useState(false);
    const [editDiscord, setEditDiscord] = useState(false);
    const [editDiscordDebug, setEditDiscordDebug] = useState(false);
    const [customAmount, setCustomAmount] = useState(1)
    const [customLimit, setCustomLimit] = useState(100)
    const [lastSafe, setLastSafe] = useState(new Date(0))

    const completeState = useAppSelector(state => state);
    const dispatch = useAppDispatch()

    function importStateFromJson(importState: string) {
        if (!importState) {
            return;
        }
        const state = JSON.parse(importState) as RootState;

        dispatch(importCharacter(state.character))

        dispatch(importCharacteristics(state.characteristics))
        dispatch(importInventory(state.inventory))
        dispatch(importSkills(state.skills))
        dispatch(importTalents(state.talents))
        dispatch(importArmoury(state.armoury))
        dispatch(importExperience(state.experience))

        saveCharToLocalStorage()
    }

    function getDiscordServer() {
        return completeState.character.discord[completeState.character.discord.active];
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
                                    onClick={() => rollAndSendToDiscord(getDiscordServer(), completeState.character.characterName, customAmount, customLimit)}
                                    variant={"light"}> Roll <FaDiceD20 color={"darkred"} style={{ cursor: "pointer" }}/>
                                </Button>
                            </Col>
                        </Form.Row>
                    </Form>
                </Row>
            </Container>
        </Jumbotron>
    }

    function getSkillsPane(layout: string) {
        const sidebarSettings = { cols: 1, showSkilledDef: true, showSettings: false }
        return layout === 'main' ? <SkillView key={'skillView'}/> : <SkillView key={'skillView'} {...sidebarSettings} />
    }

    function getTalentsPane(layout: string) {
        return <Jumbotron key={"jumbo-talents"}>
            <TalentView sidebar={layout !== 'main'}/>
        </Jumbotron>
    }

    function getInventoryPane() {
        return <Jumbotron key={"jumbo-inventory"}>
            <Row>
                <Col>
                    <h3>{getNameForTabKey(ETabNames.INVENTORY)}</h3>
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
                        <h3>{getNameForTabKey(ETabNames.SETTINGS)}</h3>
                    </Col>
                </Row>
                <Row><Col>{`Last safe - ${lastSafe}`}</Col></Row>
                <Row>
                    <Col sm={2}>
                        <Row>
                            <Col>
                                <Button size={"sm"}
                                        onClick={() => {
                                            setImportState(JSON.stringify(completeState));
                                        }}>Export</Button>
                            </Col>
                            <Col>
                                <Button size={"sm"} onClick={() => importStateFromJson(importState)}>Load</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <a href={`data:text/json;charset=utf-8,${encodeURIComponent(
                                    JSON.stringify(completeState)
                                )}`}
                                   download={completeState.character.characterName ? completeState.character.characterName + ".json" : "DnD-Character.json"}>
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
                                    onClick={() => setMainCols(Math.max(mainCols - 1, 1))}>-</Button>
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
                    <Col md={3}>
                        <Row>
                            <Col>

                                <Form.Check label="Prod" name="group1" type={'radio'} id={`discord-inline-radio-1`}
                                            checked={completeState.character.discord.active === 'prod'}
                                            onChange={() => dispatch(setDiscordActive('prod'))}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Check label="Debug" name="group1" type={'radio'} id={`discord-inline-radio-2`}
                                            checked={completeState.character.discord.active === 'debug'}
                                            onChange={() => dispatch(setDiscordActive('debug'))}
                                />

                            </Col>
                        </Row>
                    </Col>
                    <Col md={9}>
                        <Row style={{ border: 2, borderColor: 'black', borderStyle: 'solid', margin: 3 }}>
                            {editDiscord ?
                                <FormControl
                                    onMouseLeave={() => setEditDiscord(false)}
                                    value={completeState.character.discord.prod}
                                    onChange={(event => dispatch(setDiscordServer(event.target.value)))}
                                    autoFocus={true}/>
                                :
                                <h4
                                    onClick={() => setEditDiscord(true)}
                                >{completeState.character.discord.prod ? completeState.character.discord.prod : 'Click to set Discord'}</h4>
                            }
                        </Row>

                        <Row style={{ border: 2, borderColor: 'black', borderStyle: 'solid', margin: 3 }}>
                            {editDiscordDebug ?
                                <FormControl
                                    onMouseLeave={() => setEditDiscordDebug(false)}
                                    value={completeState.character.discord.debug}
                                    onChange={(event => dispatch(setDiscordServerDebug(event.target.value)))}
                                    autoFocus={true}/>
                                :
                                <h4
                                    onClick={() => setEditDiscordDebug(true)}
                                >{completeState.character.discord.debug ? completeState.character.discord.debug : 'Click to set Discord - debug'}</h4>
                            }
                        </Row>
                    </Col>
                </Row>

                {Object.keys(ETabNames)
                    .flatMap((value, index) => {
                            if (isNaN(Number(value))) {
                                return [];
                            }

                            return <Row key={`layout-${value}`}>
                                <Col xs={3}>{getNameForTabKey(index)}</Col>
                                <Col xs={9} style={{ padding: 0 }}>
                                    <Form>
                                        <div key={`inline-radio`} className="mb-3">
                                            <Form.Check inline label="Left Sidebar" name="group1" type={'radio'} id={`${value}-inline-radio-1`}
                                                        checked={completeState.character.layout.left.includes(index)}
                                                        onChange={() => dispatch(changeLayout({ field: 'left', index }))}
                                            />
                                            <Form.Check inline label="Main" name="group1" type={'radio'} id={`${value}-inline-radio-2`}
                                                        checked={completeState.character.layout.main.includes(index)}
                                                        onChange={() => dispatch(changeLayout({ field: 'main', index }))}
                                            />
                                            <Form.Check inline label="Right Sidebar" type={'radio'} id={`${value}-inline-radio-3`}
                                                        checked={completeState.character.layout.right.includes(index)}
                                                        onChange={() => dispatch(changeLayout({ field: 'right', index }))}
                                            />
                                        </div>
                                    </Form>
                                </Col>
                            </Row>
                        }
                    )}
            </Container>
        </Jumbotron>
    }


    const MINUTE_MS = 60000;

    function saveCharToLocalStorage() {
        localStorage.setItem("char", JSON.stringify(completeState));
        setLastSafe(new Date());
        console.log(`Saved char - ${lastSafe}`);
    }

    useEffect(() => {
        const storedChar = localStorage.getItem("char")
        if (storedChar) {
            importStateFromJson(storedChar)
        }

        const interval = setInterval(() => {
            saveCharToLocalStorage()
        }, MINUTE_MS);

        return () => clearInterval(interval);

    }, []);

    function getExperiencePane() {
        return <Jumbotron key={"jumbo-experience"}>
            <Row>
                <Col>
                    <h3>{getNameForTabKey(ETabNames.EXPERIENCE)}</h3>
                </Col>
            </Row>
            <ExperienceView/>
        </Jumbotron>;
    }

    function getSearchPane() {
        return <Jumbotron key={"jumbo-search"}>
            <Row>
                <Col>
                    <SearchView/>
                </Col>
            </Row>
        </Jumbotron>
    }

    function getNameForTabKey(key: ETabNames) {
        switch (key) {
            case ETabNames.CHARACTERISTICS:
                return 'Characteristics';
            case ETabNames.SKILLS:
                return 'Skills';
            case ETabNames.TALENTS:
                return 'Talents';
            case ETabNames.ARMOURY:
                return 'Armoury';
            case ETabNames.INVENTORY:
                return 'Inventory';
            case ETabNames.SETTINGS:
                return 'Settings';
            case ETabNames.EXPERIENCE:
                return "Experience"
            case ETabNames.SEARCH:
                return "Search"
            default:
                return `No name for no. ${key}`
        }
    }

    function getTabForKey(key: ETabNames, layout: string) {
        switch (key) {
            case ETabNames.CHARACTERISTICS:
                return getCharacteristicsPane();
            case ETabNames.SKILLS:
                return getSkillsPane(layout);
            case ETabNames.TALENTS:
                return getTalentsPane(layout);
            case ETabNames.ARMOURY:
                return getArmouryPane();
            case ETabNames.INVENTORY:
                return getInventoryPane();
            case ETabNames.SETTINGS:
                return getSettingsPane();
            case ETabNames.EXPERIENCE:
                return getExperiencePane();
            case ETabNames.SEARCH:
                return getSearchPane();
            default:
                return <Jumbotron>{`No tab for no. ${key}`}</Jumbotron>
        }
    }

    function getTabs(layout = 'main') {
        const panes = completeState.character.layout[layout].map(name => getTabForKey(name, layout))
        return <>
            {mainCols === 1
                ? <div>{mapElements(panes, mainCols)}</div>
                : <Row>
                    {mapElements(panes, mainCols).map((elementCol, index) => (
                        <Col key={`skillcol-${index}`} md={6}>
                            {elementCol}
                        </Col>
                    ))}
                </Row>
            }</>
    }

    return isMobile ? (
        <Row>
            <Col id="page-content-wrapper-mobile">
                <div>
                    {getTabs('left')}
                    {getTabs()}
                    {getTabs('right')}
                </div>
            </Col>
        </Row>
    ) : <Row>
            <Col md={3} id="sidebar-wrapper">
                {getTabs('left')}
            </Col>
            <Col md={6} id="page-content-wrapper">
                <div>
                    {getTabs()}
                </div>
            </Col>
            <Col md={3} id="sidebar-wrapper">
                {getTabs('right')}
            </Col>
        </Row>

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


export function mapElements(objects: JSX.Element[], colCount: number) {
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
