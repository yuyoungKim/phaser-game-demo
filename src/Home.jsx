import './App.css';
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from "wouter";
import Leaderboard from './components/Leaderboard';

function Home() {
    const handleResetClick = () => {
        // Save the username in local storage
        localStorage.clear();
    };

    // Retrieve leaderboard data from local storage
    const storedData = localStorage.getItem('Leaderboard');
    const leaderboardData = storedData ? JSON.parse(storedData) : [];

    return (
        <Container fluid className="Home-background">
            <audio controls autoplay loop>
                <source src="./sounds/homeBackground.mp3" type="audio/mpeg" />
            </audio>
            <header className="site-header">
                <video className="video-size" autoPlay muted>
                    <source
                        src="logo_animation.mp4"
                        type="video/mp4"
                    />
                </video>
            </header>
            <h1 className="Home-title">
                Sort Game
            </h1>
            {/* Bottom components aligned */}
            <div className="bottom-container">
                <h3 className="Home-summary">Sort the cards into the boxes before time runs out! If you drag and drop a card in corresponding crate, you earn 1 score. Otherwise, you lose 1 score.</h3>
                <div className="buttons">
                    <Link href="/Game">
                        <Button size="lg">Start game</Button>
                    </Link>
                    <Button size="md" onClick={handleResetClick} className="Reset-button" >Reset Leaderboard</Button>
                </div>
                <div className="Leaderboard">
                    <Leaderboard data={leaderboardData} />
                </div>
            </div>
        </Container>
    );
}

export default Home;
