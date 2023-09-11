import {useRef, useState} from "react";
import GamePhaser from "./GamePhaser";

export default function Game() {

    const [gameRef, setGameRef] = useState(null);

    return (
        

        <GamePhaser setGameRef={setGameRef} />
    )
}
