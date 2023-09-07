import './App.css';
import video from './logo_animation.mp4'
import React from 'react';


function App() {

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-logo">
        <video src={video} width="750" height="500" autoPlay={true} muted>
          </video>
        </div>

        <h1 className="App-title">
          Sort Game
        </h1>
        <h3 className="App-summary">
          Summary
        </h3> 
      </header>
      
    </div>
  );
}


export default App;
