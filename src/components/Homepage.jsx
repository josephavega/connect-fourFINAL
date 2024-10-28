import React, { useState } from 'react';
import Queue from '../components/Queue';
import Leaderboard from '../components/Leaderboard';
import ConnectPopup from './ConnectPopup';
import HelpPopup from '../components/HelpPopup'; 
import '../styles/homepage.css';


const Homepage = () => {
  const [isConnectPopupOpen, setConnectPopupOpen] = useState(false);
  const [isHelpPopupOpen, setHelpPopupOpen] = useState(false); 

  const openConnectPopup = () => setConnectPopupOpen(true);
  const closeConnectPopup = () => setConnectPopupOpen(false);

  const openHelpPopup = () => setHelpPopupOpen(true); 
  const closeHelpPopup = () => setHelpPopupOpen(false); 

  const player = [
    { username: 'Player1', gamesWon: 10, gamesLost: 5 },
    { username: 'Player2', gamesWon: 8, gamesLost: 7 },
    { username: 'Player3', gamesWon: 15, gamesLost: 3 },
    { username: 'Player4', gamesWon: 12, gamesLost: 6 },
    { username: 'Player5', gamesWon: 5, gamesLost: 10 },
    { username: 'Player6', gamesWon: 7, gamesLost: 9 },
    { username: 'Player7', gamesWon: 9, gamesLost: 8 },
    { username: 'Player8', gamesWon: 6, gamesLost: 11 },
    { username: 'Player9', gamesWon: 4, gamesLost: 13 },
    { username: 'Player10', gamesWon: 2, gamesLost: 15 },

  ];


  return (
    <div className="homepage">
      {/* Title Section */}
      <header className="title-section">
        <h1>Connect Four</h1> 
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Queue List */}
        <aside className="queue">
        <p>Queue Placeholder</p>
        </aside>

        {/* Center Section with Buttons */}
        <section className="center-section">
          <button onClick={openConnectPopup}>Connect</button>
          <button onClick={openHelpPopup}>Help</button> {/* Help Button */}
        </section>

        {/* Leaderboard List */}
        <aside className="leaderboard">
        <Leaderboard players={player} />
        </aside>
      </div>

      {/* Connect Popup */}
      {isConnectPopupOpen && <ConnectPopup onClose={closeConnectPopup} />}
      
      {/* Help Popup */}
      {isHelpPopupOpen && <HelpPopup onClose={closeHelpPopup} />} {/* Render HelpPopup if open */}
    </div>
  );
};

export default Homepage;
