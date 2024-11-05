import React, { useEffect } from 'react';
import QueueComponent from '../components/Queue';
import QueueButton from '../components/QueueButton';
import DebugButton from '../components/DebugButton';
import '../styles/lobby.css';
import queueSocket from '../sockets/queueSocket';


const Lobby = () => {

  useEffect(() => {
    // Retrieve sessionID or create a new one if not exists
    let sessionID = localStorage.getItem('sessionID');
    let username = localStorage.getItem('username');
    if (!sessionID) {
      sessionID = `session_${Math.random().toString(36).substr(2, 9)}`; // Simple unique ID generation
      localStorage.setItem('sessionID', sessionID);
    }

    console.log(`Joined Queue: ${username} with session ${sessionID}`);

    const heartbeatInterval = setInterval(() => {
      if (queueSocket && queueSocket.connected) {
        queueSocket.emit('heartbeat', { sessionID, username });
        console.log(`Heartbeat`);
      }
    }, 5000);

    return () => {
      clearInterval(heartbeatInterval);
      queueSocket.disconnect;
    }

  })

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
    </div>
  );
};

export default Lobby;
