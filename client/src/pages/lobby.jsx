import React from 'react';
import QueueComponent from '../components/Queue';
import QueueButton from '../components/QueueButton'
import DebugButton from '../components/DebugButton'

const Lobby = () => {



  return (
    <div>
      <h1>Welcome to the Lobby</h1>
      <div>
        <QueueComponent />
        <QueueButton />
      </div>
      <div>
        <DebugButton />
      </div>
    </div>
  );
};

export default Lobby;
