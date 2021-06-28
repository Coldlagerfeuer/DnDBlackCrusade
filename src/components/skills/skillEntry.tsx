import { Alert, Button, Col, Container, FormControl, InputGroup, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { addSkill, setBonus, setLevel } from "./skillSlice";
import React, { useState } from "react";
import { FaDiceD20 } from "react-icons/all";


export const SkillEntryFunction = ({
                                       skillName = 'SKILLNAME',
                                       showType = true,
                                       showSkilled = false,
                                       callbackRoll
                                   }: { skillName: string, showType: boolean, showSkilled: boolean, callbackRoll: any }) => {
    const skills = useAppSelector(state => state.skills);
    const characteristics = useAppSelector(state => state.characteristics);
    const characterName = useAppSelector(state => state.character.characterName);
    const discordServer = useAppSelector(state => state.character.discordServer);
    const dispatch = useAppDispatch();

    const [show, setShow] = useState(false);
    const [text, setText] = useState('');
    const [variant, setVariant] = useState('success');
    const [newLore, setNewLore] = useState('');

    const skill = skills[skillName];
    if (!skill) {
        console.error(`No skill for name '${skillName}' found`);
        return <></>;
    }
    const { name, level, type, bonus, parent } = skill;

    const description = showType ? `${parent ? `-> ${name}` : name} (${type})` : `${parent ? `-> ${name}` : name}`

    if (showSkilled && level === 0) {
        return <></>
    }

    function roll() {
        const rollResult = callbackRoll(discordServer, characterName, characteristics[type.toUpperCase()]?.value, skill)

        setVariant(rollResult.result ? 'success' : 'danger');
        setShow(true);
        setTimeout(() => setShow(false), 15000)
        setText(`${name} Test: rolled ${rollResult.rolls} your level: ${rollResult.sum} = Test ${rollResult.result ? 'success' : 'failed'}`)


    }

    function getDiceCol() {
        return <Col md={1}><FaDiceD20 onClick={() => roll()} color={"darkred"} style={{ cursor: "pointer" }}/></Col>
    }

    function getNameCol() {
        return <Col md={5}>
            {description} </Col>;
    }

    function getEditRow() {

        if (name.endsWith("Lore") || name === "Trade" ) {
            return <>
                {getElement()}
                <Row style={{ padding: 0 }}>
                    <Col>
                        <Button size={"sm"} onClick={() => dispatch(addSkill({ name: newLore, level: 1, type, bonus: 0, parent: skill}))}>+</Button>
                    </Col>
                    <Col md={10} style={{ padding: 0 }}>
                        <FormControl size={'sm'} placeholder="New Lore"
                                     onChange={(event => setNewLore(event.target.value))}
                        />
                    </Col>
                </Row>
            </>
        }


        function getElement() {
            return <Row style={{ padding: 0 }}>
                {getNameCol()}
                <Col md={5} style={{ padding: 0 }}>
                    <InputGroup>
                        <InputGroup.Checkbox checked={level > 0} onChange={() => dispatch(setLevel({ ...skill, level: 1 }))}/>
                        <InputGroup.Checkbox checked={level > 1} onChange={() => dispatch(setLevel({ ...skill, level: 2 }))}/>
                        <InputGroup.Checkbox checked={level > 2} onChange={() => dispatch(setLevel({ ...skill, level: 3 }))}/>
                        <InputGroup.Checkbox checked={level > 3} onChange={() => dispatch(setLevel({ ...skill, level: 4 }))}/>
                    </InputGroup>
                </Col>
                <Col md={2} style={{ padding: 0 }}>
                    <FormControl size={'sm'} value={bonus}
                                 onChange={(event => dispatch(setBonus({ ...skill, bonus: parseInt(event.target.value) })))}
                    />
                </Col>
            </Row>;
        }

        return getElement();
    }

    function getSkilledRow() {
        return <Row>
            {getDiceCol()}
            {getNameCol()}
            <Col>{(level - 1) * 10}</Col>
            <Col>{characteristics[type.toUpperCase()]?.value}</Col>
            <Col>{bonus}</Col>
            <Col><b>{(level - 1) * 10 + characteristics[type.toUpperCase()]?.value + bonus}</b></Col>
        </Row>;
    }

    return <Container style={{ padding: 0 }}>
        {showSkilled ? getSkilledRow() : getEditRow()}
        <Alert onClose={() => setShow(false)} show={show} variant={variant}>
            {text}
        </Alert>
    </Container>

}
