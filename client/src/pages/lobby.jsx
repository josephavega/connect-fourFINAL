import React from 'react';
import QueueComponent from '../components/Queue';
import QueueButton from '../components/QueueButton';
import DebugButton from '../components/DebugButton';
import Game from './Game';
import GameButton from '../components/GameButton';
import '../styles/lobby.css';

const Lobby = () => {
  return (
    <div className="lobby-container">
      <h1 className="waiting-text">Waiting for next game...</h1>
      <div className="queue">
        <QueueComponent />
      </div>
      <div className="queue-button-container">
        <QueueButton />
        <img 
          src="../src/assets/Menu/Buttons/Button_Join.png" 
          alt="Join Queue" 
          className="join-button-overlay" 
        />
      </div>
      <div className="debugButton">
        <DebugButton />
      </div>
      <div>
        <GameButton />
      </div>
    </div>
  );
};

export default Lobby;
