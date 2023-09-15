import './App.css';
import React from 'react';
import {Container, Button} from 'react-bootstrap';
import {Link} from "wouter";
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
      <video className="video-size" autoPlay muted>
        <source
          src="logo_animation.mp4"
          type="video/mp4"
        />
      </video>
      <h1 className="Home-title">
        Sort Game
      </h1>
      <Link href="/Game" >
        <Button size="lg" className="Start-button" >Start game</Button>
      </Link>
      <Leaderboard className="Leaderboard" data={leaderboardData} />
      <Button size="md" onClick={handleResetClick} className="Reset-button" >Reset Leaderboard</Button>
    </Container>
  );
}

export default Home;
