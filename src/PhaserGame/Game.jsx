import { useRef, useState } from "react";
import GamePhaser from "./GamePhaser";
import { useRouter, useLocation } from 'wouter';

export default function Game() {
    const [gameRef, setGameRef] = useState(null);
    return (
        <div>
            <GamePhaser setGameRef={setGameRef} />
        </div>
        );
    }