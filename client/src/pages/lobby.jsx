import React, { useState } from 'react';
import QueueComponent from '../components/Queue';
import Leaderboard from '../components/Leaderboard'; 
import QueueButton from '../components/QueueButton';
import DebugButton from '../components/DebugButton';
import GameButton from '../components/GameButton';
import Gameboard from '../components/Gameboard';
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
    <div className="lobby-wrapper">
      {/* Left Side Container */}
      <div className="lobby-container">
        
        <div className="toggle-buttons">
          <button 
            onClick={() => setView('queue')} 
            className={`toggle-button ${view === 'queue' ? 'active' : ''}`}
          >
            Queue
          </button>
          <button 
            onClick={() => setView('leaderboard')} 
            className={`toggle-button ${view === 'leaderboard' ? 'active' : ''}`}
          >
            Leaderboard
          </button>
        </div>

        <div className="queue">
          {view === 'queue' ? <QueueComponent /> : <Leaderboard />}
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

      {/* Right Side  */}
      <div className="right-container">
        <div className="gameboardBox">
          <Gameboard />
        </div>
      </div>
    </div>
  );
};

export default Lobby;
