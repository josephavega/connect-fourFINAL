import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/connectPopup.css";
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid'; // Use a library like uuid to generate unique IDs

const ConnectPopup = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState(null); // State for socket instance
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Retrieve or generate sessionID
    let sessionID = localStorage.getItem('sessionID');
    if (!sessionID) {
      sessionID = uuidv4(); // Generate a unique ID for the user
      localStorage.setItem('sessionID', sessionID);
    }

    // Set up the socket connection using sessionID
    const newSocket = io('http://localhost:3000', {
      query: {
        sessionID: sessionID,
      },
    });

    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []); // Run only once when component mounts

  const joinQueue = () => {
    if (username.trim() === '') {
      alert('Please enter a username.');
      return;
    }

    const sessionID = localStorage.getItem('sessionID');

    // Emit join queue event through socket
    if (socket) {
      socket.emit('joinQueue', username, sessionID);
    }

    // Make API request to join the queue
    fetch('http://localhost:3000/joinQueue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, sessionID }), // Include sessionID in the payload
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        const { message, redirect } = data;

        if (redirect === '/lobby') {
        onClose();
        navigate('/lobby');
        } else {
        console.log('Join Queue Response:', data);
        localStorage.setItem('username', username);
        alert(`${username} has joined the queue.`);
        onClose(); // Close the popup after adding the player
        navigate('/lobby'); // Navigate to the lobby page only after successful join
        }
      })
      .catch(error => {
        console.error('Error joining queue:', error);
        alert(`Failed to join queue: ${error.message}`);
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
