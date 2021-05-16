import {
    Badge,
    Button,
    ButtonGroup,
    ButtonToolbar,
    Card,
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
    editArmour,
    editCategory,
    editDescription,
    EItemCategory,
    IItem,
    removeItem,
    TItem
} from "./inventorySlice";
import { Typeahead } from 'react-bootstrap-typeahead';
import { allItems } from "../character/resources";
import { IArmourItem, IWeapon, setGear, setWeapon } from "../armoury/armourySlice";
import { AiOutlineSortAscending, GiCrossedSwords } from "react-icons/all";
import { WeaponCard } from "../armoury/weaponCard";
import { ArmourCard } from "../armoury/armourCard";

export const InventoryFunction = () => {
    const [readonly, toggleReadonly] = useState(true)
    const [newItem, setNewItem] = useState('')
    const [activeFilter, setFilter] = useState('-')


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
                    const armour = item as IArmourItem;
                    return <Button
                        disabled={!!armoury.gear[armour.name]}
                        onClick={() => {
                            dispatch(setGear(armour))
                            dispatch(removeItem(item))
                        }}>Equip</Button>

                case EItemCategory.MISC:
                case EItemCategory.NONE:
                    return <Button onClick={() => dispatch(removeItem(item))}>USE</Button>
            }


            return undefined;
        }

        function getWeaponCard(item: TItem) {
            const weapon = item as IWeapon;

            return <WeaponCard weapon={weapon} editMode={!readonly}/>;
        }

        function getArmourCard(item: IItem) {
            const armour: IArmourItem = item as IArmourItem;

            return<ArmourCard armour={armour} />
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


                    <Col md={item.category === EItemCategory.WEAPON || item.category === EItemCategory.ARMOUR ? 5 : 12}>

                        <InputGroup>
                            <FormControl as="textarea" readOnly={readonly} size={"sm"} rows={10}
                                         value={item.description}
                                         aria-label="Description"
                                         onChange={(event) => {
                                             dispatch(editDescription({ ...item, description: event.target.value }))
                                         }}/>
                        </InputGroup>
                    </Col>
                    {item.category === EItemCategory.WEAPON ? <Col>{getWeaponCard(item)}</Col> : <></>}
                    {item.category === EItemCategory.ARMOUR ? <Col>{getArmourCard(item)}</Col> : <></>}
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
        }
        return <Pencil/>;
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

                                <Button disabled><AiOutlineSortAscending/></Button>
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


                            <Typeahead
                                className={'form-control'}
                                id="basic-typeahead-single"
                                // options={['John', 'Paul', 'George', 'Ringo']}
                                options={itemOptions}
                                onInputChange={(name) => setNewItem(name)}
                                // onChange={(value: string) => console.log(value, 'Simple typeahead')}
                                onChange={(selection) => setNewItem(selection[0]?.toString())}
                            />
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
