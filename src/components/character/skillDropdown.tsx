import { Dropdown } from "react-bootstrap";

export function SkillDropdown() {



    return (
        //inside of return
        <div className="dropdown">
            <Dropdown>
                <Dropdown.Toggle
                    variant="secondary btn-sm"
                    id="dropdown-basic">
                    Language
                </Dropdown.Toggle>

                <Dropdown.Menu style={{backgroundColor:'#73a47'}}>
                    <Dropdown.Item href="#" >Arabic</Dropdown.Item>
                    <Dropdown.Item href="#">English</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>

    );
}
