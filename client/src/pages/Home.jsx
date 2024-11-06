import React, { useState } from 'react';
import Leaderboard from '../components/Leaderboard';
import ConnectPopup from '../components/ConnectPopup';
import QueueComponent from '../components/Queue';
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
      <img src="./src/assets/Menu/Logo/Logo_Together.png" alt="Logo Together" />
      </header>

      {/* Main Content */}
      <div className="main-content">

        {/* Center Section with Buttons */}
        <section className="center-section">
        <button><img src="./src/assets/Menu/Buttons/Button_Join.png" alt="Join Button" onClick={openConnectPopup} /></button>
          <button><img src="./src/assets/Menu/Buttons/Button_Help.png" alt="Help Button" onClick={openHelpPopup} /></button>
        </section>

        {/* Leaderboard List */}
        {/* <aside className="leaderboard">
        <Leaderboard players={player} />
        </aside> */}
      </div>

      {/* Connect Popup */}
      {isConnectPopupOpen && <ConnectPopup onClose={closeConnectPopup} />}
      
      {/* Help Popup */}
      {isHelpPopupOpen && <HelpPopup onClose={closeHelpPopup} />} {/* Render HelpPopup if open */}
    </div>
  );
};

export default Homepage;
