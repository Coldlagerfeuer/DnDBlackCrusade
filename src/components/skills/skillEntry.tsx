import { Alert, Col, Container, InputGroup, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { setLevel } from "./skillSlice";
import { useState } from "react";


export const SkillEntryFunction = ({ skillName = 'SKILLNAME', showType = true, showSkilled = false }) => {
    const skills = useAppSelector(state => state.skills);
    const characteristics = useAppSelector(state => state.characteristics);
    const dispatch = useAppDispatch();

    const [show, setShow] = useState(false);

    const skill = skills[skillName];
    const { name, level, type } = skill;

    const description = showType && type ? `${name} (${type})` : `${name}`

    if (showSkilled && level === 0) {
        return <></>
    }

    function getAlert() {
        const s = Math.floor(Math.random() * 100);
        const levelSum = (level === 0 ? -20 : (level - 1) * 10) + characteristics[type.toUpperCase()]?.value;
        const result = s - levelSum < 0 ? 'success' : 'failed';
        const variant = s - levelSum < 0 ? 'success' : 'danger';
        return <Alert onClose={() => setShow(false)} show={show} variant={variant}>
            {`${name} Test: rolled ${s} your level: ${levelSum} = Test ${result}`}
        </Alert>
    }

    return <Container>
        <Row>
            <Col md={5}
                 onClick={() => {
                     setShow(true);
                     setTimeout(() => setShow(false), 10000)
                 }}
            >
                {description}
            </Col>
            <Col md={7}>
                <InputGroup>
                    <InputGroup.Checkbox checked={level > 0}
                                         onChange={() => dispatch(setLevel({ ...skill, level: 1 }))}/>
                    <InputGroup.Checkbox checked={level > 1}
                                         onChange={() => dispatch(setLevel({ ...skill, level: 2 }))}/>
                    <InputGroup.Checkbox checked={level > 2}
                                         onChange={() => dispatch(setLevel({ ...skill, level: 3 }))}/>
                    <InputGroup.Checkbox checked={level > 3}
                                         onChange={() => dispatch(setLevel({ ...skill, level: 4 }))}/>
                </InputGroup>
            </Col>
        </Row>
        {getAlert()}

    </Container>

}
