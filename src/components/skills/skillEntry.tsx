import { Col, Container, InputGroup, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { setLevel } from "./skillSlice";


export const SkillEntryFunction = ({ name = 'SKILLNAME', showType = true, showSkilled = true }) => {
    const skills = useAppSelector(state => state.skills);
    const dispatch = useAppDispatch()

    const level = skills[name]?.level;
    const description = showType && skills[name].type ? `${name} (${skills[name].type})` : `${name}`

    if (showSkilled && level === 0) {
        return <></>
    }

    return <Container>
        <Row>
            <Col md={5} onClick={() => {
                const s = Math.floor(Math.random() * 100);
                const result = s - level < 0 ? 'success' : 'failed';
                console.log(`${name} Test: rolled ${s} your level: ${level} = Test ${result}`)
            }}>
                {description}
            </Col>
            <Col md={7}>
                <InputGroup>
                    <InputGroup.Checkbox checked={level > 0} onChange={() => dispatch(setLevel({ name, level: 1 }))}/>
                    <InputGroup.Checkbox checked={level > 1} onChange={() => dispatch(setLevel({ name, level: 2 }))}/>
                    <InputGroup.Checkbox checked={level > 2} onChange={() => dispatch(setLevel({ name, level: 3 }))}/>
                    <InputGroup.Checkbox checked={level > 3} onChange={() => dispatch(setLevel({ name, level: 4 }))}/>
                </InputGroup>
            </Col>
        </Row>
    </Container>

}
