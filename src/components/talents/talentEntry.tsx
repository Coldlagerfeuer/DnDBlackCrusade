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

    function getTierDescription(tier: number) {
        switch (tier) {
            case -2: return "Reward";
            case -1: return "Gift";
            case 0: return "Trait";
            default: return `T${tier}`;
        }
    }

    return <OverlayTrigger
        key={`talent-${talent.name}`}
        placement={'bottom'}
        overlay={
            <Tooltip id={`tooltip-${talent.name}`}>
                {talent.description}
            </Tooltip>
        }
    >
        <div onClick={() => setActiveTalent(talent)}>
            <Badge>{`${getTierDescription(talent.tier)} ${talent.name}${talent.specialization ? ` (${talent.specialization})` : ''}`}</Badge>

            {/*{talent.tier === 0*/}
            {/*    ? <Badge>{`Trait ${talent.name}${talent.specialization ? ` (${talent.specialization})` : ''}`}</Badge>*/}
            {/*    : talent.tier === -1 ? <Badge>{`Gift ${talent.name}${talent.specialization ? ` (${talent.specialization})` : ''}`}</Badge>*/}
            {/*        : <Badge>{`T${talent.tier} ${talent.name}${talent.specialization ? ` (${talent.specialization})` : ''}`}</Badge>*/}
            {/*}*/}
        </div>
    </OverlayTrigger>

}
