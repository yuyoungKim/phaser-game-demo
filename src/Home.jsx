import './App.css';
import React from 'react';
import {Container, Button} from 'react-bootstrap';
import {Link} from "wouter";


function Home() {
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
    </Container>
  );
}

export default Home;
