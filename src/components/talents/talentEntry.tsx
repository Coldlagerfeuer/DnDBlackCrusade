import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAppSelector } from "../../general/hooks";
import React from "react";


export const TalentEntryFunction = ({ name = 'TALENTNAME' }) => {
    const talents = useAppSelector(state => state.talents);
    // const dispatch = useAppDispatch()

    const talent = talents[name];

    return  <OverlayTrigger
        key={`talent-${talent.name}`}
        overlay={
            <Tooltip id={`tooltip-${talent.name}`}>
                {talent.description}
            </Tooltip>
        }
    >
        <Badge>{`T${talent.tier} ${talent.name}`}</Badge>
    </OverlayTrigger>

}
