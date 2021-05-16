import {
    Badge,
    Button,
    Card,
    Col,
    Dropdown,
    FormControl,
    InputGroup,
    OverlayTrigger,
    Row,
    Tooltip
} from "react-bootstrap";
import {
    BiQuestionMark,
    GiAncientSword,
    GiArrowScope, GiBulletImpacts,
    GiChainsaw, GiElectric,
    GiLaserPrecision,
    GiMachineGunMagazine,
    GiPistolGun,
    GiReloadGunBarrel,
    GiShieldImpact,
    GiWeight,
    IoMdCheckmarkCircle
} from "react-icons/all";
import React, { useState } from "react";
import './weaponCard.scss';
import { EWeaponCategory, EWeaponType, IWeapon, removeWeapon } from "./armourySlice";
import { addItem, editWeapon, changeWeaponName } from "../inventory/inventorySlice";
import { useAppDispatch, useAppSelector } from "../../general/hooks";


export const WeaponCard = ({ weapon, editMode = false }: { weapon: IWeapon, editMode?: boolean }) => {
    const [newName, setNewName] = useState(weapon.name);

    const weaponEquipped = useAppSelector(state => state.armoury.weapons[weapon.name]);

    const dispatch = useAppDispatch();


    function getJSXForWeaponCategory(cat: EWeaponCategory) {
        switch (cat) {
            case EWeaponCategory.SWORD:
                return <GiAncientSword/>;
            case EWeaponCategory.PISTOL:
                return <GiPistolGun/>
            case EWeaponCategory.CHAIN:
                return <GiChainsaw/>
        }
        return <BiQuestionMark/>
    }


    function getJSXForWeaponType(weaponType: EWeaponType) {
        switch (weaponType) {
            case EWeaponType.IMPACT: return <GiBulletImpacts />
            case EWeaponType.RENDING: return <GiChainsaw />
            case EWeaponType.SCHOCK: return <GiElectric />
            case EWeaponType.LASER: return <GiLaserPrecision />

        }

        return <BiQuestionMark/>;
    }

    function getWeaponTypeDropdown() {
        return <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                {getJSXForWeaponCategory(weapon.weaponCategory)}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {Object.values(EWeaponCategory).map((value, index) => {
                        // @ts-ignore
                        const e = EWeaponCategory[index]
                        return e ? <Dropdown.Item
                            key={`category-dropdown-${e}`}
                            onClick={() => {
                                dispatch(editWeapon({ ...weapon, weaponCategory: index }))
                            }}>{e}</Dropdown.Item> : <></>
                    }
                )}
            </Dropdown.Menu>
        </Dropdown>
    }

    function getWeightField(col = 2) {
        return editMode ?
            <Col md={col}> <GiWeight/> <FormControl size={"sm"}
                                                    value={weapon.weight}
                                                    placeholder={"1"}
                                                    aria-label="Weight"
                                                    onChange={(event) => dispatch(editWeapon({ ...weapon, weight: parseInt(event.target.value) }))}/> </Col>
            :<Col md={col}> <GiWeight/> {weapon.weight} </Col>
    }


    function getDamageField() {
        return editMode ?
            <Col md={4}>
                Damage
                <FormControl size={"sm"}
                             value={weapon.damage}
                             placeholder={"xd10+y"}
                             aria-label="Damage in Form xd10 + y"
                             onChange={(event) => dispatch(editWeapon({ ...weapon, damage: event.target.value }))}/>
                <div>
                    <Badge variant={'success'} style={{ cursor: 'pointer' }}
                           onClick={() => dispatch(editWeapon({ ...weapon, pen: weapon.pen? weapon.pen + 1 : 1}))}>+</Badge>
                    <Badge pill={true} variant={"secondary"}> <GiShieldImpact/> {weapon.pen ? weapon.pen : 0} </Badge>
                    <Badge variant={'danger'} style={{ cursor: 'pointer' }}
                           onClick={() => dispatch(editWeapon({
                               ...weapon,
                               pen: weapon.pen ? Math.max(weapon.pen - 1, 0) : 0
                           }))}>-</Badge>
                </div>

                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {getJSXForWeaponType(weapon.type)}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {Object.values(EWeaponType).map((value, index) => {
                                // @ts-ignore
                                const e = EWeaponType[index]
                                return e ? <Dropdown.Item
                                    key={`category-dropdown-${e}`}
                                    onClick={() => {
                                        dispatch(editWeapon({ ...weapon, type: index }))
                                    }}
                                >{e}</Dropdown.Item> : <></>
                            }
                        )}
                    </Dropdown.Menu>
                </Dropdown>

            </Col>
            : <Col md={4}>{weapon.damage} <Badge pill={true} variant={"secondary"}> <GiShieldImpact/> {weapon.pen}
            </Badge> </Col>
    }

    function getRangeField() {
        return editMode ?
            <Col> <GiArrowScope/> Range<FormControl size={"sm"}
                                                    placeholder={"30"}
                                                    value={weapon.range}
                                                    aria-label="Range in m"
                                                    onChange={(event) => dispatch(editWeapon({
                                                        ...weapon,
                                                        range: parseInt(event.target.value)
                                                    }))}/>
                Rate of Fire
                <FormControl size={"sm"}
                             value={weapon.rof}
                             placeholder={"s/-/6"}
                             aria-label="Rate of Fire"
                             onChange={(event) => dispatch(editWeapon({ ...weapon, rof: event.target.value }))}/>
            </Col>
            : <Col> <GiArrowScope/> {weapon.range}m - {weapon.rof} </Col>
    }

    function getMagazineField() {
        return editMode ?
            <Col> <GiMachineGunMagazine/> Magazine <FormControl size={"sm"}
                                                                value={weapon.clip}
                                                                placeholder={"8"}
                                                                aria-label="Magazine"
                                                                onChange={(event) => dispatch(editWeapon({
                                                                    ...weapon,
                                                                    clip: parseInt(event.target.value)
                                                                }))}/>
                <GiReloadGunBarrel/> Reload <FormControl size={"sm"}
                                                         value={weapon.rld}
                                                         placeholder={"FULL | HALF"}
                                                         aria-label="Magazine"
                                                         onChange={(event) => dispatch(editWeapon({
                                                             ...weapon,
                                                             rld: event.target.value
                                                         }))}/>

            </Col>
            : <Col> <GiMachineGunMagazine/>{weapon.clip} <GiReloadGunBarrel/> {weapon.rld} </Col>
    }

    function getRemoveFromArmoury() {
        return weaponEquipped ?
            <Col md={1}>
                <Badge variant={'danger'} style={{ cursor: 'pointer' }}
                       onClick={() => {
                           dispatch(removeWeapon(weapon));
                           dispatch(addItem(weapon))
                       }}>-
                </Badge>
            </Col> : <></>
    }

    function getNameField() {
        return <Col>
            <OverlayTrigger
                key={`weaponCardTooltip-${weapon.name}`}
                overlay={
                    <Tooltip
                        id={`tooltip-${weapon.name}`}>{weapon.description ? weapon.description : "Add description"}</Tooltip>
                }>
                {editMode ? <Row>
                        {!isRangeWeapon() ?
                            <Col md={4}>
                                {getWeaponTypeDropdown()}
                            </Col>
                            : <></>
                        }
                        <Col>
                            {isRangeWeapon() ?  getWeaponTypeDropdown() : <></>}
                            <InputGroup>
                                <FormControl size={"sm"}
                                             value={newName}
                                             placeholder={"Description"}
                                             aria-label="Description"
                                             onChange={(event) => setNewName(event.target.value)}/>
                                <InputGroup.Append>
                                    <Button size={"sm"}
                                            placeholder={"Name"}
                                            onClick={(event) => {
                                        dispatch(changeWeaponName({
                                            ...weapon,
                                            name: newName,
                                            oldName: weapon.name
                                        }))
                                    }}>
                                        <IoMdCheckmarkCircle cursor={"pointer"} color={"white"}/>
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Row>
                    : <div>{getJSXForWeaponCategory(weapon.weaponCategory)} {getJSXForWeaponType(weapon.type)} {weapon.name}</div>
                }

            </OverlayTrigger>
        </Col>
    }

    function isRangeWeapon() {
        return weapon.weaponCategory > EWeaponCategory._
    }

    function getWeaponCard() {
        if (isRangeWeapon()) {
            return getWeaponCardMeele()
        } else {
            return getWeaponCardRange()
        }
    }

    function getWeaponCardMeele() {
        return <Card key={`weaponCard${weapon.name}`}>
            <Card.Header>
                <Row>
                    {getNameField()}
                    {getDamageField()}
                    {getWeightField()}
                    {getRemoveFromArmoury()}
                </Row>
            </Card.Header>
        </Card>;
    }


    function getWeaponCardRange() {
        return <Card key={`weaponCard${weapon.name}`}>
            <Card.Header>
                <Row>
                    {getNameField()}
                    {getWeightField()}
                    {getRemoveFromArmoury()}
                </Row>
            </Card.Header>
            <Card.Body>
                <Row>
                    {getDamageField()}
                    {getRangeField()}
                    {getMagazineField()}
                </Row>
            </Card.Body>
        </Card>;
    }

    return getWeaponCard()

}
