import {
    Alert,
    Badge,
    Button,
    Card,
    Col, Container,
    Dropdown, DropdownButton,
    FormControl,
    InputGroup,
    OverlayTrigger,
    Row,
    Tooltip
} from "react-bootstrap";
import {
    BiCrosshair,
    BiQuestionMark, FaDiceD20,
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
import { EWeaponCategory, EDamageType, IWeapon, removeWeapon } from "./armourySlice";
import { addItem, editWeapon, changeWeaponName } from "../inventory/inventorySlice";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import {
    IDamageRoll,
    IRollResult,
    IStatRoll,
    rollAimAndSendToDiscord,
    rollDamageAndSendToDiscord,
    rollStatAndSendToDiscord
} from "../character/Rolls";
import { getHitLocation } from "./armoury";


export const WeaponCard = ({ weapon, editMode = false }: { weapon: IWeapon, editMode?: boolean }) => {
    const [newName, setNewName] = useState(weapon.name);

    const weaponEquipped = useAppSelector(state => state.armoury.weapons[weapon.name]);
    const character = useAppSelector(state => state.character);
    const characteristics = useAppSelector(state => state.characteristics);
    const [testModifier, setTestModifier] = useState(10);
    const [bonusRolls, setBonusRolls] = useState(0);

    const [show, setShow] = useState(false);
    const [text, setText] = useState('');
    const [variant, setVariant] = useState('success');

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


    function getJSXForWeaponType(weaponType: EDamageType) {
        switch (weaponType) {
            case EDamageType.IMPACT:
                return <GiBulletImpacts/>
            case EDamageType.RENDING:
                return <GiChainsaw/>
            case EDamageType.SCHOCK:
                return <GiElectric/>
            case EDamageType.LASER:
                return <GiLaserPrecision/>

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
                            }}>{e}</Dropdown.Item> : null
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
                                                    onChange={(event) => dispatch(editWeapon({
                                                        ...weapon,
                                                        weight: parseInt(event.target.value)
                                                    }))}/> </Col>
            : <Col md={col}> <GiWeight/> {weapon.weight} </Col>
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
                           onClick={() => dispatch(editWeapon({
                               ...weapon,
                               pen: weapon.pen ? weapon.pen + 1 : 1
                           }))}>+</Badge>
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
                        {Object.values(EDamageType).map((value, index) => {
                                // @ts-ignore
                                const e = EDamageType[index]
                                return e ? <Dropdown.Item
                                    key={`category-dropdown-${e}`}
                                    onClick={() => {
                                        dispatch(editWeapon({ ...weapon, type: index }))
                                    }}
                                >{e}</Dropdown.Item> : null
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
            : <Col> <GiMachineGunMagazine/> {weapon.clip} <GiReloadGunBarrel/> {weapon.rld} </Col>
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
                        {!isMeeleWeapon() ?
                            <Col md={4}>
                                {getWeaponTypeDropdown()}
                            </Col>
                            : <></>
                        }
                        <Col>
                            {isMeeleWeapon() ? getWeaponTypeDropdown() : <></>}
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
                    :
                    <div>{getJSXForWeaponCategory(weapon.weaponCategory)} {getJSXForWeaponType(weapon.type)} {weapon.name}</div>
                }

            </OverlayTrigger>
        </Col>
    }

    function getRollDice() {
        const characteristic = isMeeleWeapon() ? characteristics["WS"] : characteristics["BS"];
        const bonusDrop = [<Dropdown.Header key={`aim-header-${weapon.name}`}>Aim Modifier</Dropdown.Header>];
        const bonusRollDrop = [<Dropdown.Header key={`rolls-header-${weapon.name}`}>Bonus Rolls</Dropdown.Header>];

        // dropItems.push();
        for (let i = 60; i > -70; i -= 10) {
            bonusDrop.push(<Dropdown.Item key={`${weapon.name}-modifier-${i}`} onClick={() => setTestModifier(i)}>{i}</Dropdown.Item>);
        }
        for (let i = 0; i < 10; i++) {
            bonusRollDrop.push(<Dropdown.Item key={`${weapon.name}-rolls-${i}`} onClick={() => setBonusRolls(i)}>{i}</Dropdown.Item>);
        }


        return <Row>
            <Col>
                <DropdownButton size="sm" title={testModifier} variant={'secondary'}>
                    {bonusDrop}
                </DropdownButton>
            </Col>
            <Col>
                <DropdownButton size="sm"  title={bonusRolls} variant={'secondary'}>
                    {bonusRollDrop}
                </DropdownButton>
            </Col>
            <Col>
                <Button size="sm" variant="light"
                        onClick={() => showAimAlert(rollAimAndSendToDiscord(character.discord[character.discord.active], character.characterName, characteristic, testModifier))}
                >
                    <BiCrosshair style={{ cursor: "pointer" }}
                    /> Aim
                </Button>
            </Col>
            <Col>
                <Button size="sm" variant="light"
                        onClick={() => showDamageAlert(rollDamageAndSendToDiscord(character.discord[character.discord.active], character.characterName, weapon, bonusRolls))}
                >
                    <FaDiceD20 color={"darkred"}
                               style={{ cursor: "pointer" }}
                    /> Damage
                </Button>
            </Col>
        </Row>;
    }

    function showAimAlert(rollResult: IStatRoll) {
        setVariant(rollResult.result ? 'success' : 'danger');
        setShow(true);
        setTimeout(() => setShow(false), 15000)
        setText(`Stat ${rollResult.characteristics.value + rollResult.modifier} Rolled ${rollResult.rollSum} = Test ${rollResult.result ? 'success' : 'failed'} 
        ${getHitLocation(rollResult.rollSum)}`)
    }

    function showDamageAlert(rollResult: IDamageRoll) {
        setShow(false);
        setShow(true);
        setVariant('info')
        setTimeout(() => setShow(false), 15000)
        setText(`Damage: ${rollResult.rollSum + rollResult.damage} - Pen: ${rollResult.pen} - Rolls: ${JSON.stringify(rollResult.rolls)}`)
    }

    function isMeeleWeapon() {
        return weapon.weaponCategory > EWeaponCategory._
    }

    function getWeaponCard() {
        if (isMeeleWeapon()) {
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
            <Card.Body style={{ padding: 10 }}>
                {getRollDice()}
                <Alert onClose={() => setShow(false)} show={show} variant={variant}>
                    {text}
                </Alert>
            </Card.Body>
        </Card>;
    }


    function getWeaponCardRange() {
        return <Card key={`weaponCard${weapon.name}`}>
            <Card.Header>
                <Row>
                    {getNameField()}
                    {getDamageField()}
                    {getWeightField()}
                    {getRemoveFromArmoury()}
                </Row>
            </Card.Header>
            <Card.Body style={{ padding: 5 }}>
                <Row>
                    {getRangeField()}
                    {getMagazineField()}
                </Row>
                {getRollDice()}
                <Alert onClose={() => setShow(false)} show={show} variant={variant}>
                    {text}
                </Alert>
            </Card.Body>
        </Card>;
    }

    return getWeaponCard()

}
