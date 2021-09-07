import { Col, Container, FormControl, InputGroup, Row } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { allItems, allTalents } from "../character/resources";
import React, { createRef, useState } from "react";
import { IItem } from "../inventory/inventorySlice";
import { ITalent } from "../talents/talentSlice";
import { log } from "util";


export type ISearchable = IItem | ITalent

export const SearchView = () => {
    const emptyTalent = {} as ITalent

    const testRef = createRef<HTMLTextAreaElement>()

    const [activeSearch, setActiveSearch] = useState({ name: '', description: '' } as ISearchable);

    const searchOptions: string[] = [];

    // Object.keys(allTalents).forEach(value => searchOptions.push(value));
    // Object.keys(allItems).forEach(value => searchOptions.push(value));
    Object.keys({ ...allTalents, ...allItems }).forEach(value => searchOptions.push(value));

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
                    })
                    }
                    selected={{ ...allTalents, ...allItems }[activeSearch.name] ? [activeSearch.name] : []}
                />
            </Col>
        </Row>
        {{ ...allTalents, ...allItems }[activeSearch.name] ?
            <Row>
                <Col>
                    <FormControl placeholder={'Description'} aria-describedby="basic-addon1"
                                 as="textarea" size={"sm"} rows={10}
                                 value={JSON.stringify(activeSearch, null, "\t")
                                     .replaceAll('\\n', "\n")
                                     .replaceAll('"', '')
                                 }
                                 autoFocus
                                 plaintext={true}
                    />
                </Col>
            </Row>
            : undefined
        }
    </Container>
}
