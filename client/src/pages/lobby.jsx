import React, { useState, useEffect } from 'react';
import QueueComponent from '../components/Queue';
import Leaderboard from '../components/Leaderboard'; 
import QueueButton from '../components/QueueButton';
import DebugButton from '../components/DebugButton';
import GameButton from '../components/GameButton';
import PickPlayerPopUp from '../components/PickPlayerPopUp';
import queueSocket from '../sockets/queueSocket';
import gameSocket from '../sockets/gameSocket';
import '../styles/lobby.css';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
  const [view, setView] = useState('queue');
  const [isPopupVisible, setIsPopupVisible] = useState(false); 
  const [queue, setQueue] = useState([]); 
  const [selectedOpponent, setSelectedOpponent] = useState('');
  const [usernameA, setUsernameA] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get the username from local storage
    setUsernameA(localStorage.getItem('username') || 'Guest');
    
    // Event listener for game starting signal
    const handleStartGame = (data) => {
      console.log('Received startGame event:', data);
      if (data.mode === 'Player vs AI') {
        navigate('/game', { state: { mode: 'Player vs AI', difficulty: data.difficulty } });
      } else if (data.mode === 'Player vs Player') {
        navigate('/game', { state: { mode: 'Player vs Player', opponent: data.opponent } });
      }
    };

    // Event listener for joining the queue
    const handleQueueUpdate = (updatedQueue) => {
      console.log('Queue updated:', updatedQueue);
      setQueue(updatedQueue);
    };

    // Set up socket event listeners for game and queue
    queueSocket.on('queueUpdated', handleQueueUpdate);
    gameSocket.on('startGame', handleStartGame);

    return () => {
      // Clean up socket event listeners when the component is unmounted
      queueSocket.off('queueUpdated', handleQueueUpdate);
      gameSocket.off('startGame', handleStartGame);
    };
  }, [navigate]);


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
      {/* <div>
        <iframe 
        src="/game" title="Spectate Game" style={{
        width: '670px', 
        height: '530px', 
        border: 'none',
        background: 'transparent',        transform: 'scale(1)', 
        transformX: 'scale(100px)',
        transformOrigin: 'right', 
        


    }}> </iframe>
      </div> */}
      <aside className="lobby-container">
       {/*<Spectate/>*/}
      </aside>  
    </div>
    
  );
};

export default Lobby;
