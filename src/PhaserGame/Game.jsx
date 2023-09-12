import { useRef, useState } from "react";
import GamePhaser from "./GamePhaser";
import { Button } from 'react-bootstrap';
import { useRouter, useLocation } from 'wouter';

export default function Game() {
    const { push } = useRouter();
    const [gameRef, setGameRef] = useState(null);
    const [, navigate] = useLocation();
    const handleExit = () => {
        // Use wouter's hook for navigation
        navigate("/");  // Navigate to home or any route you desire
    }
    return (
        <div>
            <GamePhaser setGameRef={setGameRef} navigate={navigate} />
        </div>
        );
    }