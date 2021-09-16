import { Button, FormControl, InputGroup, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import React, { CSSProperties, useState } from "react";
import { GiCrossMark } from "react-icons/all";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { addEntry, IExpEntry, removeEntry } from "./experienceSlice";
import { PlusCircle } from "react-bootstrap-icons";
import { EGods } from "../talents/talentSlice";


export const ExperienceView = () => {
    const experience = useAppSelector(state => state.experience);
    const dispatch = useAppDispatch();

    const [newEntry, setNewEntry] = useState({} as IExpEntry);

    function calcExpSum(index: number, array: IExpEntry[]) {
        return array.slice(0, index + 1).reduce((sum, { amount }) => sum + amount, 0);
    }

    function getStyleForDevotion(devotion: EGods): CSSProperties {
        switch (devotion) {
            case EGods.NURGLE: return {backgroundColor: "brown", color: "white"}
            case EGods.KHORNE: return {backgroundColor: "red"}
            case EGods.SLAANESH: return {backgroundColor: "pink"}
            case EGods.TZEENTCH: return {backgroundColor: "lightskyblue"}
            default: return {backgroundColor: "white"}
        }
    }

    return <Row>
        <Table striped borderless hover size={"sm"}>
            <thead>
            <tr>
                <th>#</th>
                <th>Comment</th>
                <th>Amount</th>
                <th>Sum</th>
                <th>-</th>
            </tr>
            </thead>
            <tbody>

            {experience.entries.map((value, index, array) =>
                <tr key={`tr-${index}-${value.description}`}>
                    <td style={getStyleForDevotion(value.devotion)}>{index}</td>
                    <td>{value.description}</td>
                    <td>{value.amount}</td>
                    <td>{calcExpSum(index, array)}</td>
                    <td style={{ cursor: 'pointer' }}>
                        <OverlayTrigger
                            overlay={
                                <Tooltip id={`remove`}>
                                    Remove entry
                                </Tooltip>
                            }>
                            <GiCrossMark onClick={() => dispatch(removeEntry(index))} color={"red"}/>
                        </OverlayTrigger>
                    </td>
                </tr>
            )}
            <tr>
                <td colSpan={2}><b>Remaining</b></td>
                <td colSpan={2}><b>{experience.expSum}</b></td>
            </tr>

            </tbody>
        </Table>
        <InputGroup>
            <FormControl
                placeholder={"Comment"}
                value={newEntry.description ? newEntry.description : ""}
                size={"lg"}
                onChange={(event => setNewEntry({
                    ...newEntry,
                    description: event.target.value
                }))}
            />
            <FormControl
                placeholder={"Amount"}
                value={newEntry.amount ? newEntry.amount : ""}
                size={"lg"}
                onChange={(event => setNewEntry({
                    ...newEntry,
                    amount: Number(event.target.value)
                }))}
            />
            <Button
                onClick={() => dispatch(addEntry(newEntry))}
                variant="outline-primary">
                <PlusCircle/>
            </Button>
        </InputGroup>
    </Row>;

}
