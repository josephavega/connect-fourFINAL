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


  useEffect(() => {
    // Retrieve sessionID or create a new one if not exists
    let sessionID = localStorage.getItem('sessionID');
    if (!sessionID) {
      sessionID = uuidv4(); // Generate a unique ID
      localStorage.setItem('sessionID', sessionID);
    }

    // Check if user is already in queue
    queueSocket.emit('inQueue', sessionID);
    
    // Add a listener for the inQueue response
    queueSocket.once('inQueueResponse', (inQueue) => {
      if (inQueue) {
        navigate('/lobby'); // Navigate directly to the lobby if user is already in the queue
        onClose();
      }
    });

    // Cleanup listener when component unmounts
    return () => {
      queueSocket.off('inQueueResponse');
    };
  }, [navigate, onClose]);
  // Need to add functionality such that if the player sessionID is already in the queue, 
  // it skips the popup and sends them straight to the queue

  const joinQueue = () => {
    const sessionID = localStorage.getItem('sessionID');
    
    if (username.trim() === '' || username.length !== 3) {
      alert('Username must be exactly 3 characters long.');
      return;
    }

    // Emit join queue event through socket
    const data = { username, sessionID };
    queueSocket.emit('joinQueue', data);

    // Listen for the server's response (use `once` to avoid redundant listeners)
    queueSocket.once('joinQueueResponse', (data) => {
      if (data.success) {
        console.log('Join Queue Response:', data);
        localStorage.setItem('username', username);
        console.log(data.message);

        // Redirect to the lobby if necessary
        if (data.redirectToLobby) {
          navigate('/lobby'); // Navigate to the lobby page
          onClose();
        } else {
          onClose(); // Close the popup after adding the player
          navigate('/lobby'); // Navigate to the lobby page after successful join
        }
      } else {
        console.log('Failed to join Queue');
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
              onChange={(e) => setUsername(e.target.value.toUpperCase())}
              placeholder="Enter your username"
              maxLength="3"
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
