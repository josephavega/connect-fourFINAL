import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/connectPopup.css";
import queueSocket from '../sockets/queueSocket';
import gameSocket from '../sockets/gameSocket';
import { v4 as uuidv4 } from 'uuid'; // Use a library like uuid to generate unique IDs

const ConnectPopup = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState(null); // State for socket instance
  const navigate = useNavigate(); // Initialize navigate

  // Need to add functionality such that if the player sessionID is already in the queue, 
  // it skips the popup and sends them straight to the queue

  const joinQueue = () => {
    if (username.trim() === '') {
      alert('Please enter a username.');
      return;
    }

    const sessionID = localStorage.getItem('sessionID');

    // Emit join queue event through socket
      const data = {username, sessionID}
      queueSocket.emit('joinQueue', data);

      // Listen for the server's response
      queueSocket.on('joinQueueResponse', (data) => {
        if (data.success) {
          console.log('Join Queue Response:', data);
          localStorage.setItem('username', username);
          console.log(data.message);
  
          // Check if the user should be redirected to the lobby
          if (data.redirectToLobby) {
            navigate('/lobby'); // Navigate to the lobby page
            onClose();
          } else {
            onClose(); // Close the popup after adding the player
            navigate('/lobby'); // Navigate to the lobby page after successful join
          }
        } else {
          //alert(`Failed to join queue: ${data.message}`);
          console.log('Failed to join Queue')
        }
      });
    
  };
  return (
    <div className="connect-popup-overlay">
      <div className="connect-popup">
        <div className="popup-header">
          <h2>Start a Game</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="popup-content">
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </label>
          <button onClick={joinQueue} className="start-btn">
            Join Queue
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConnectPopup;
