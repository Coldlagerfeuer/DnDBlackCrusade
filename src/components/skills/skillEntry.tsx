import { Alert, Badge, Button, Col, Container, FormControl, InputGroup, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { addSkill, expMapSkills, removeSkill, setBonus, setLevel } from "./skillSlice";
import React, { useState } from "react";
import { FaDiceD20 } from "react-icons/all";
import { devotionMap, EGods } from "../talents/talentSlice";
import { allSkills } from "../character/resources";
import { addEntry } from "../character/experienceSlice";


export const SkillEntryFunction = ({
                                       skillName = 'SKILLNAME',
                                       showType = true,
                                       showSkilled = false,
                                       callbackRoll
                                   }: { skillName: string, showType: boolean, showSkilled: boolean, callbackRoll: any }) => {
    const skills = useAppSelector(state => state.skills);
    const characteristics = useAppSelector(state => state.characteristics);
    const characterName = useAppSelector(state => state.character.characterName);
    const devotion = useAppSelector(state => state.character.devotion);
    const discordServer = useAppSelector(state => state.character.discord[state.character.discord.active]);
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
                        <Button size={"sm"} onClick={() => dispatch(addSkill({ name: newLore, level: 1, type, bonus: 0, parent: skill, devotion: EGods.UNALIGNED}))}>+</Button>
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
            function changeLevel(level: number) {
                dispatch(setLevel({ ...skill, level }));

                // calcNeededExp
                const characterDevotion = devotion ? devotion : EGods.UNALIGNED;
                const skillDevotion = skill.devotion ? skill.devotion : allSkills[skill.name].devotion;

                for (let lv = skill.level; lv < level; lv++) {
                    const exp = expMapSkills[devotionMap[skillDevotion][characterDevotion]][lv];
                    dispatch(addEntry({description: `${skill.name} Level ${lv}`, amount: -exp, type: "SKILL", devotion: skillDevotion}))
                }
            }

            return <Row style={{ padding: 0 }}>
                {getNameCol()}
                <Col md={4} style={{ padding: 0 }}>
                    <InputGroup>
                        <InputGroup.Checkbox checked={level > 0} onChange={() => changeLevel(1)}/>
                        <InputGroup.Checkbox checked={level > 1} onChange={() => changeLevel(2)}/>
                        <InputGroup.Checkbox checked={level > 2} onChange={() => changeLevel(3)}/>
                        <InputGroup.Checkbox checked={level > 3} onChange={() => changeLevel(4)}/>
                    </InputGroup>
                </Col>
                <Col md={2} style={{ padding: 0 }}>
                    <FormControl size={'sm'} value={bonus}
                                 onChange={(event => dispatch(setBonus({ ...skill, bonus: parseInt(event.target.value) })))}
                    />
                </Col>
                {parent ?
                <Col md={1}>
                    <Badge variant={'danger'} style={{ cursor: 'pointer' }}
                           onClick={() => {
                               dispatch(removeSkill(skill))
                           }}>-
                    </Badge>
                </Col> : <></>}
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
        <Alert dismissible onClose={() => setShow(false)} show={show} variant={variant}>
            {text}
        </Alert>
    </Container>

}
