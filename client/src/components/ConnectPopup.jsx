import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Importing the uuid library
import "../styles/connectPopup.css"; // Import the CSS for the popup
import CloseButtonImg from "../../../public/Menu/Buttons/Help_Settings_Exit.png"; // Correct path to your image
import BlueBoard from "../../../public/Menu/BlueBoard.png";

import "../styles/global.css";

const ConnectPopup = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve sessionID or create a new one if it doesn't exist
    let sessionID = localStorage.getItem("sessionID");
    if (!sessionID) {
      sessionID = uuidv4(); // Corrected to call the uuid function
      localStorage.setItem("sessionID", sessionID);
    }

    // Check if user is already in the queue using a GET request with fetch
    fetch(`http://localhost:3000/queue/isInQueue?sessionID=${sessionID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to check queue status: " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
        if (data.inQueue) {
          navigate("/lobby"); // Navigate directly to the lobby if user is already in the queue
          onClose();
        }
      })
      .catch((error) => {
        console.error("Error checking queue status:", error);
      });
  }, [navigate, onClose]);

  const joinQueue = () => {
    const sessionID = localStorage.getItem("sessionID");

    if (!/^[a-zA-Z0-9]{3}$/.test(username)) {
      // Makes sure Username is three alphanumeric characters
      alert("Username must be exactly 3 characters long.");
      return;
    }

    // Send API request to join the queue using fetch
    fetch("http://localhost:3000/queue/joinQueue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionID, username }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to join queue: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          localStorage.setItem("username", username);
          navigate("/lobby"); // Navigate to the lobby page after successful join
          onClose();
        } else {
          console.error(data.message);
          alert(`Failed to join queue: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error("Error joining queue:", error);
        navigate("/lobby");
        // alert("An error occurred while attempting to join the queue.");
      });
  };

  return (
    <div className="connect-popup-overlay">
      <div
        className="connect-popup"
        style={{
          backgroundImage: `url(${BlueBoard})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "15px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="popup-header">
          <h2>Join Queue</h2>
          <button className="close-btn" onClick={onClose}>
            <img src={CloseButtonImg} alt="Close" />
          </button>
        </div>
        <div className="popup-content">
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toUpperCase())}
              placeholder="Enter your username"
              maxLength="3"
            />
          </label>
          <button onClick={joinQueue} className="start-btn">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectPopup;
