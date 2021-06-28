import React from 'react';
import './App.scss';
import { CharacterFunction } from "./components/character/character";
import { Container } from "react-bootstrap";


function App() {
    return (
        <Container fluid className="App" style={{ backgroundColor: "black" }}>

            <CharacterFunction/>

        </Container>
    );
}

export default App;
