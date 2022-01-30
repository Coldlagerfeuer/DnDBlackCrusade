import { SkillEntryFunction } from "./skillEntry";
import { Button, Col, Container, Jumbotron, Row } from "react-bootstrap";
import { rollTestAndSendToDiscord } from "../character/Rolls";
import React, { useState } from "react";
import { mapElements } from "../character/character";
import { useAppSelector } from "../../general/hooks";

export const SkillView = ({ cols = 2, showTypeDef = true, showSkilledDef = false, showSettings = true }) => {

    const [skillCols, setSkillCols] = useState(cols);
    const [showType, toggleShowType] = useState(showTypeDef);
    const [showSkilled, toggleShowSkilled] = useState(showSkilledDef);
    const skills = useAppSelector(state => state.skills)


    function createSkillMatrix(colCount: number = 2, showType: boolean, showSkilled: boolean, callbackRoll: any) {
        const skillObjects: JSX.Element[] = [];
        const skillNames: string[] = showSkilled ? Object.values(skills).filter(value => value.level > 0).map(skill => skill.parent ? `${skill.parent.name} - ${skill.name}` : skill.name) : Object.keys(skills);
        skillNames.sort((a, b) => a.localeCompare(b))

        skillNames.forEach(skillName => {
            skillObjects.push(
                <SkillEntryFunction key={`skill-${skillName}`}  {...{
                    skillName,
                    showType,
                    showSkilled,
                    callbackRoll
                }} />
            )
        });
        return mapElements(skillObjects, colCount);
    }


    return <Jumbotron key={"jumbo-skills"}>
        <Row>
            <Col>
                <h3>Skills</h3>
            </Col>
        </Row>
        {showSettings ? <Row>Col: {skillCols}
            <Button style={{ padding: 0, width: '10px', height: '25px' }} variant="outline-secondary" size="sm"
                    onClick={() => setSkillCols(skillCols - 1)}>-</Button>
            <Button style={{ padding: 0, width: '10px', height: '25px' }} variant="outline-secondary" size="sm"
                    onClick={() => setSkillCols(skillCols + 1)}>+</Button>
            <Button size={"sm"} style={{ padding: 0, height: '25px' }}
                    onClick={() => toggleShowType(!showType)}>Type</Button>
            <Button size={"sm"} style={{ padding: 0, height: '25px' }}
                    onClick={() => toggleShowSkilled(!showSkilled)}>Skilled</Button>
        </Row> : <></>}
        <Container fluid>
            <Row>
                {createSkillMatrix(skillCols, showType, showSkilled, rollTestAndSendToDiscord).map((skillCols, index) => (
                    <Col key={`skillcol-${index}`}>
                        <Col>
                            {showSkilled ? <Row>
                                    <Col md={1}>{/* EMPTY */}</Col>
                                    <Col md={5}><b>Skillname</b></Col>
                                    <Col>T</Col>
                                    <Col>C</Col>
                                    <Col>B</Col>
                                    <Col><b>Sum</b></Col>
                                </Row>
                                : <Row>
                                    <Col md={5}><b>Skillname</b></Col>
                                    <Col md={4} style={{ padding: 0 }}>
                                        <span style={{ paddingLeft: 0, paddingRight: 12 }}><b>T</b></span>
                                        <span style={{ paddingLeft: 5, paddingRight: 5 }}><b>+10</b></span>
                                        <span style={{ paddingLeft: 5, paddingRight: 5 }}><b>+20</b></span>
                                        <span style={{ paddingLeft: 5, paddingRight: 5 }}><b>+30</b></span>
                                    </Col>
                                    <Col md={2}>Bonus</Col>
                                </Row>
                            }
                        </Col>
                        {skillCols}
                    </Col>
                ))}
            </Row>
        </Container>
    </Jumbotron>
}
