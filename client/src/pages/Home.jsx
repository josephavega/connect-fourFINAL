import React, { useState } from "react";
import ConnectPopup from "../components/ConnectPopup";
import HelpPopup from "../components/HelpPopup";
import DebugButton from "../components/DebugButton";

import JoinButton from "../../../public/Menu/Buttons/Button_Join.png";
import HelpButton from "../../../public/Menu/Buttons/Button_Help.png";
import Logo from "../../../public/Menu/Logo/Logo_Together.png";
import Background from "../../../public/Forest16_9.png";
import "../styles/homepage.css";

const Homepage = () => {
  const [isConnectPopupOpen, setConnectPopupOpen] = useState(false);
  const [isHelpPopupOpen, setHelpPopupOpen] = useState(false);

  const openConnectPopup = () => setConnectPopupOpen(true);
  const closeConnectPopup = () => setConnectPopupOpen(false);

  const openHelpPopup = () => setHelpPopupOpen(true);
  const closeHelpPopup = () => setHelpPopupOpen(false);

  return (
    <div
      className="homepage"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover", // Ensures the image covers the entire background
        backgroundPosition: "center", // Centers the image
        height: "100vh", // Ensures the div takes the full height of the viewport
        width: "100vw", // Ensures the div takes the full width of the viewport
      }}
    >
      {/* Title Section */}
      <header className="title-section">
        <img src={Logo} alt="Connect 4" />
      </header>
      {/* Main Content */}
      <div className="main-content">
        {/* Center Section with Buttons */}
        <section className="center-section">
          <button>
            <img
              src={JoinButton}
              alt="Join Button"
              onClick={openConnectPopup}
            />
          </button>
          <button>
            <img src={HelpButton} alt="Help Button" onClick={openHelpPopup} />
          </button>
        </section>
        <div>{/* <DebugButton/> */}</div>
      </div>
      {/* Connect Popup */}
      {isConnectPopupOpen && <ConnectPopup onClose={closeConnectPopup} />}
      {/* Help Popup */}
      {isHelpPopupOpen && <HelpPopup onClose={closeHelpPopup} />}{" "}
      {/* Render HelpPopup if open */}
    </div>
  );
};

export default Homepage;
