import { IInventory, IItem } from "../inventory/inventorySlice";
import { IArmour, IWeapon, IWeaponState } from "../armoury/armourySlice";
import { allArmour, allItems, allWeapons } from "../character/resources";
import { EItemCategory } from "../character/EItemCategory";
import { Button, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import { ETabNames } from "../character/ETabNames";
import { FileUploadDrop } from "../character/fileUploadDrop";
import { changeLayout, setDiscordActive, setDiscordServer, setDiscordServerDebug } from "../character/characterSlice";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { saveCharToDiscord } from "../character/Rolls";

export const Settings = ({importStateFromJson, getNameForTabKey} : {
    importStateFromJson: (importState: string) => void,
    getNameForTabKey: (key: ETabNames) => string
}) => {

    const [importState, setImportState] = useState('');
    const [editDiscord, setEditDiscord] = useState(false);
    const [editDiscordDebug, setEditDiscordDebug] = useState(false);

    const completeState = useAppSelector(state => state);
    const dispatch = useAppDispatch()


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

    return <Container>
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
                    </Row>
                    <Row>
                        <Col>
                            <Button onClick={() => saveCharToDiscord(completeState)}>
                                Save to Discord
                            </Button>
                        </Col>
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



}


