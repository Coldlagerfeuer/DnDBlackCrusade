import React from 'react';
import './App.scss';
import { CharacterFunction } from "./components/character/character";
import { Col, Row } from "react-bootstrap";

function App() {
    return (
        <div className="App" style={{ backgroundColor: "black" }}>
            {/*<header className="App-header">*/}
            {/*  <img src={logo} className="App-logo" alt="logo" />*/}
            {/*  <p>*/}
            {/*    Edit <code>src/App.tsx</code> and save to reload.*/}
            {/*  </p>*/}

            {/*  <a*/}
            {/*    className="App-link"*/}
            {/*    href="https://reactjs.org"*/}
            {/*    target="_blank"*/}
            {/*    rel="noopener noreferrer"*/}
            {/*  >*/}
            {/*    Learn React*/}
            {/*  </a>*/}
            {/*</header>*/}
            <div>
                <CharacterFunction/>
            </div>
        </div>
    );
}

export default App;
