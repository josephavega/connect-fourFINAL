import React, { useState } from 'react';
import ConnectPopup from '../components/ConnectPopup';
import HelpPopup from '../components/HelpPopup'; 
import DebugButton from '../components/DebugButton';
import '../styles/homepage.css';

const Homepage = () => {
  const [isConnectPopupOpen, setConnectPopupOpen] = useState(false);
  const [isHelpPopupOpen, setHelpPopupOpen] = useState(false); 

  const openConnectPopup = () => setConnectPopupOpen(true);
  const closeConnectPopup = () => setConnectPopupOpen(false);

  const openHelpPopup = () => setHelpPopupOpen(true); 
  const closeHelpPopup = () => setHelpPopupOpen(false); 


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
        <div>
          {/* <DebugButton/> */}
        </div>
      </div>

      {/* Connect Popup */}
      {isConnectPopupOpen && <ConnectPopup onClose={closeConnectPopup} />}
      
      {/* Help Popup */}
      {isHelpPopupOpen && <HelpPopup onClose={closeHelpPopup} />} {/* Render HelpPopup if open */}
    </div>
  );
};

export default Homepage;
