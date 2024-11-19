import React, { useState, useEffect } from 'react';
import QueueComponent from '../components/Queue';
import Leaderboard from '../components/Leaderboard'; 
import QueueButton from '../components/QueueButton';
import DebugButton from '../components/DebugButton';
import GameButton from '../components/GameButton';
//import PickPlayerPopUp from '../components/PickPlayerPopUp';
import Gameboard from '../components/Gameboard';
import '../styles/lobby.css';
import queueSocket from '../sockets/queueSocket';

const Lobby = () => {
  const [view, setView] = useState('queue');
  const [isPopupVisible, setIsPopupVisible] = useState(false); 
  const [queue, setQueue] = useState([]); 
  const [selectedOpponent, setSelectedOpponent] = useState('');
  const currentUser = 'NPC';

  const fetchQueue = () => {
    const simulatedQueue = [
      { username: 'User1' },
      { username: 'User2' },
      { username: 'User3' },
    ];
    setQueue(simulatedQueue);
  };

  
   const handleJoinClick = () => {
    fetchQueue(); 
    setIsPopupVisible(true); 
  };


  const handleOpponentSelect = (opponent) => {
    setSelectedOpponent(opponent);
    console.log('Selected opponent:', opponent);
    setIsPopupVisible(false);
  };


  const handlePopupClose = () => {
    setIsPopupVisible(false); 
  };

  return (
    <div className="lobby-wrapper">
      {/* Left Side Container */}
      <aside className="lobby-container">
        
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
            onClick={handleJoinClick}
          />
        </div>
        
        <div className="debugButton">
          <DebugButton />
        </div>

        <div>
          <GameButton />
        </div>
      </aside>

      {/* Middle Side */}
      <main className="right-container">
        <div className="gameboardBox">
         {/* I had to comment out <Gameboard />, it was causing unknown issues */}
        </div>
      </main>
      
      {/* Right Side */}
      <aside className="lobby-container">
        <div className="gameboardBox">
          Spectated Powerups will show here
        </div>
      </aside>
      {isPopupVisible && (
  <PickPlayerPopUp
    queue={queue} 
    currentUser={currentUser} 
    onOpponentSelect={handleOpponentSelect} 
    onClose={handlePopupClose} 
  />
)}
    </div>
  );
};

export default Lobby;
