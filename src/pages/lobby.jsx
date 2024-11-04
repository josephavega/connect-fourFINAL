import React from 'react';
import QueueComponent from '../components/Queue';
import QueueButton from '../components/QueueButton';
import DebugButton from '../components/DebugButton';
import Game from './game';
import GameButton from '../components/GameButton';

const Lobby = () => {
  return (
    <div>
      <div>
        <QueueComponent />
        <QueueButton />
      </div>
      <h1>Welcome to the Lobby</h1>
      <div>
        <DebugButton />
      </div>
      <div>
        <GameButton />
      </div>
    </div>
  );
};

export default Lobby;
