import { Col, Container, InputGroup, Row } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { allItems, allTalents } from "../character/resources";
import React, { useState } from "react";
import { IItem } from "../inventory/inventorySlice";
import { ITalent } from "../talents/talentSlice";


export type ISearchable = IItem | ITalent

export const SearchView = () => {
    const emptyTalent = {} as ITalent

    const [activeSearch, setActiveSearch] = useState({name: '', description: ''} as ISearchable);

    const searchOptions: any[] = [];
    Object.keys(allTalents).forEach(value => searchOptions.push(value));
    Object.keys(allItems).forEach(value => searchOptions.push(value));

    return <Container>
        <Row>
            <Col>
                <Typeahead
                    placeholder={'Search'}
                    id="basic-typeahead-search"
                    options={searchOptions}
                    paginationText={"More..."}
                    size={"large"}
                    onInputChange={(name) => setActiveSearch({ ...emptyTalent, name: name })}
                    onChange={(selection) => setActiveSearch({
                        ...activeSearch, ...allTalents[selection[0]?.toString()], ...allItems[selection[0]?.toString()],
                        name: selection[0]?.toString()
                    })}
                    selected={{...allTalents, ...allItems}[activeSearch.name] ? [activeSearch.name] : []}
                />
            </Col>
        </Row>
        <Row>
            <Col>
                {JSON.stringify(activeSearch)}
            </Col>
        </Row>
    </Container>
}
