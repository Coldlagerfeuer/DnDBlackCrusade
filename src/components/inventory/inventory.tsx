import {
    Button,
    ButtonGroup,
    ButtonToolbar,
    Col,
    Dropdown,
    FormControl,
    InputGroup,
    ListGroup,
    Row,
    Tab
} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import React, { useState } from "react";
import { GearFill, Pencil, PlusCircle, ShieldFill } from "react-bootstrap-icons";
import {
    addItemByName,
    editCategory,
    editDescription,
    IInventory,
    IItem,
    importInventory,
    removeItem,
    TItem
} from "./inventorySlice";
import { Typeahead } from 'react-bootstrap-typeahead';
import { allItems } from "../character/resources";
import { IArmour, ISpell, IWeapon, setGear, setWeapon } from "../armoury/armourySlice";
import { AiOutlineSortAscending, GiCrossedSwords, GiOrbWand } from "react-icons/all";
import { WeaponCard } from "../armoury/weaponCard";
import { ArmourCard } from "../armoury/armourCard";
import { SpellCard } from "../armoury/spellCard";
import { EItemCategory } from "../character/EItemCategory";

export const InventoryFunction = () => {
    const [readonly, toggleReadonly] = useState(true);
    const [newItem, setNewItem] = useState('');
    const [activeFilter, setFilter] = useState('-');


    const items = useAppSelector(state => state.inventory);
    const armoury = useAppSelector(state => state.armoury)
    const dispatch = useAppDispatch()


    const itemOptions = [];
    for (const item in allItems) {
        itemOptions.push(item);
    }


    function createListItems() {
        const result: JSX.Element[] = [];
        for (const name in items) {
            if (EItemCategory.NONE === activeFilter || items[name].category === activeFilter)
                result.push(<ListGroup.Item action href={`#link${name}`} key={`listitem-${name}`}>
                    {name}
                </ListGroup.Item>)
        }
        return result;
    }

    function createTabPanes() {
        const result: JSX.Element[] = [];

        function getItemButton(item: TItem) {
            switch (item.category) {
                case EItemCategory.WEAPON:
                    const weapon = item as IWeapon;
                    return <Button
                        disabled={!!armoury.weapons[weapon.name]}
                        onClick={() => {
                            dispatch(setWeapon(weapon))
                            dispatch(removeItem(item))
                        }}>Equip</Button>

                case EItemCategory.ARMOUR:
                    const armour = item as IArmour;
                    return <Button
                        disabled={!!armoury.gear[armour.name]}
                        onClick={() => {
                            dispatch(setGear(armour))
                            dispatch(removeItem(item))
                        }}>Equip</Button>

                case EItemCategory.SPELL:
                    const spell = item as ISpell;

                    return <Button
                        disabled={!!armoury.weapons[spell.name]}
                        onClick={() => {
                            dispatch(setWeapon(spell))
                            dispatch(removeItem(item))
                        }}>Equip</Button>

                case EItemCategory.MISC:
                case EItemCategory.NONE:
                    return <Button onClick={() => dispatch(removeItem(item))}>USE</Button>
            }


            return undefined;
        }


        function getTypeCard(item: IItem) {
            switch (item.category) {
                case EItemCategory.WEAPON:
                    return <Col><WeaponCard weapon={item as IWeapon} editMode={!readonly}/></Col>
                case EItemCategory.ARMOUR:
                    return <Col><ArmourCard armour={item as IArmour}/></Col>
                case EItemCategory.SPELL:
                    return <Col><SpellCard spell={item as ISpell}/></Col>
            }
        }

        for (const name in items) {
            const item: IItem = items[name];
            result.push(<Tab.Pane eventKey={`#link${name}`} key={`tabpane-${name}`}>
                <Row>
                    <Col>
                        {item.name} - Count: {item.count}
                    </Col>
                    <Col>
                        <ButtonGroup>
                            {readonly ? <Button disabled>{item.category}</Button>
                                : <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {item.category}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {Object.values(EItemCategory).map((value, index) =>
                                            // <Dropdown.Item href={`#/action-${index}`}>{value}</Dropdown.Item>)}
                                            <Dropdown.Item
                                                key={`category-dropdown-${value}`}
                                                onClick={() => {
                                                    dispatch(editCategory({ ...item, category: value }))
                                                }}>{value}</Dropdown.Item>)}
                                    </Dropdown.Menu>
                                </Dropdown>
                            }
                            <Button variant={"outline-secondary"}
                                    onClick={() => toggleReadonly(!readonly)}><Pencil/></Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row>


                    <Col md={item.category === EItemCategory.NONE || item.category === EItemCategory.MISC ? 12 : 5}>

                        <InputGroup>
                            <FormControl as="textarea" readOnly={readonly} size={"sm"} rows={10}
                                         value={item.description}
                                         aria-label="Description"
                                         onChange={(event) => {
                                             dispatch(editDescription({ ...item, description: event.target.value }))
                                         }}/>
                        </InputGroup>
                    </Col>
                    {getTypeCard(item)}
                </Row>
                {getItemButton(item)}
            </Tab.Pane>)
        }
        return result;
    }

    function getJSXForItemCategory(value: string) {
        switch (value) {
            case EItemCategory.NONE:
                return 'ALL';
            case EItemCategory.MISC:
                return <GearFill/>
            case EItemCategory.ARMOUR:
                return <ShieldFill/>
            case EItemCategory.WEAPON:
                return <GiCrossedSwords/>
            case EItemCategory.SPELL:
                return <GiOrbWand/>
        }
        return <Pencil/>;
    }

    function sortInventory() {
        const itemsSorted: IInventory = {};
        Object.keys(items).sort((a, b) => a.localeCompare(b)).map(key => itemsSorted[key] = items[key])

        console.log(items)
        console.log(itemsSorted)

        dispatch(importInventory(itemsSorted))

    }

    return <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
        <Row>
            <Col sm={3}>
                <ListGroup variant="flush">

                    <ListGroup.Item>
                        <ButtonToolbar>

                            <ButtonGroup size={"sm"}
                                         className={"mr-2"}
                            >

                                <Button onClick={() => sortInventory()}><AiOutlineSortAscending/></Button>
                            </ButtonGroup>
                            <ButtonGroup size="sm">
                                {Object.values(EItemCategory).map((value: string) =>
                                    <Button key={`filter-btn-${value}`}
                                            variant={activeFilter === value ? "primary" : "secondary"}
                                            onClick={() => {
                                                setFilter(value);
                                            }}>{getJSXForItemCategory(value)}</Button>)}
                            </ButtonGroup>
                        </ButtonToolbar>
                    </ListGroup.Item>

                    {createListItems()}
                    {/* Add Button */}
                    <ListGroup.Item>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <Button onClick={() => dispatch(addItemByName(newItem))}
                                        variant="outline-primary">
                                    {items[newItem] ? <Pencil/> : <PlusCircle/>}
                                </Button>
                            </InputGroup.Prepend>

                            {/*<FormControl aria-describedby="basic-addon1"*/}
                            {/*             onChange={(event => setNewItem(event.target.value))}/>*/}

                            <div style={{ width: '9.87em' }}>
                                <Typeahead
                                    id="basic-typeahead-single"
                                    // options={['John', 'Paul', 'George', 'Ringo']}
                                    options={itemOptions}
                                    onInputChange={(name) => setNewItem(name)}
                                    // onChange={(value: string) => console.log(value, 'Simple typeahead')}
                                    onChange={(selection) => setNewItem(selection[0]?.toString())}
                                />
                            </div>
                        </InputGroup>
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col sm={9}>
                <Tab.Content>
                    {createTabPanes()}
                </Tab.Content>
            </Col>
        </Row>
    </Tab.Container>

}
