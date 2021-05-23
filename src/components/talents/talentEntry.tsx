import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAppSelector } from "../../general/hooks";
import React from "react";
import { ITalent } from "./talentSlice";


export const TalentEntryFunction = ({
                                        name = 'TALENTNAME',
                                        setActiveTalent
                                    }: { name: string, setActiveTalent: React.Dispatch<React.SetStateAction<ITalent>> }) => {
    const talents = useAppSelector(state => state.talents);
    // const dispatch = useAppDispatch()

    const talent = talents[name];

    return <OverlayTrigger
        key={`talent-${talent.name}`}
        overlay={
            <Tooltip id={`tooltip-${talent.name}`}>
                {talent.description}
            </Tooltip>
        }
    >
        <div onClick={() => setActiveTalent(talent)}>
            <Badge>{`T${talent.tier} ${talent.name}${talent.specialization ? ` (${talent.specialization})` : ''}`}</Badge>
        </div>
    </OverlayTrigger>

}
