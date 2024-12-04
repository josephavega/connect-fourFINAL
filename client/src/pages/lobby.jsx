import React, { useState, useEffect } from 'react';
import QueueComponent from '../components/Queue';
import QueueButton from '../components/QueueButton';
import DebugButton from '../components/DebugButton';
import GameButton from '../components/GameButton';
import PickPlayerPopUp from '../components/PickPlayerPopUp';
import '../styles/lobby.css';

const Lobby = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [queue, setQueue] = useState([]);
  const [selectedOpponent, setSelectedOpponent] = useState('');
  const [usernameA, setUsernameA] = useState('');

  useEffect(() => {
    setUsernameA(localStorage.getItem('username') || 'Guest');
  }, []);

  const currentUser = usernameA;

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
      <aside className="lobby-container">
      <button
        className="back-to-home"
        onClick={() => (window.location.href = '/')} 
      >
        <img src="../src/assets/Menu/Buttons/Help_Settings_Exit.png" alt="Back to Home" />
      </button>

        <div className="queue">
          <QueueComponent />
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

      <main className="right-container">
        <div className="gameboardBox">
          {/* <Gameboard /> */}
        </div>
      </main>

      {isPopupVisible && (
        <PickPlayerPopUp
          queue={queue}
          currentUser={currentUser}
          onOpponentSelect={handleOpponentSelect}
          onClose={handlePopupClose}
        />
      )}

      <div>
        <iframe
          src="/game"
          title="Spectate Game"
          style={{
            width: '670px',
            height: '530px',
            border: 'none',
            background: 'transparent',
            transform: 'scale(1)',
            transformX: 'scale(100px)',
            transformOrigin: 'right',
          }}
        ></iframe>
      </div>
    </div>
  );
};

export default Lobby;
