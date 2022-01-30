import React, { useEffect, useState } from 'react';
import './App.scss';
import { CharacterFunction } from "./components/character/character";
import { Container } from "react-bootstrap";


function App() {

    const [width, setWidth] = useState<number>(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return <Container fluid className="App" style={{ backgroundColor: "black" }}>
            <CharacterFunction isMobile={width <= 1024} />
        </Container>
}



export default App;
