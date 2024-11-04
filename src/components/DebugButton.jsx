import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/connectPopup.css";
import { io } from 'socket.io-client';
import '../styles/debugButton.css'

const DebugButton = () => {



  const [username, setUsername] = useState('');
  const [sessionID, setSessionID] = useState(null);
  const [serverUsername, setServerUsername] = useState('');

  function updateData() {
    // Retrieve local data
    const localUsername = localStorage.getItem('username');
    const localSessionID = localStorage.getItem('sessionID');

    setUsername(localUsername);
    setSessionID(localSessionID);

    // Fetch user data from the server using the session ID
    if (localSessionID) {
        fetch(`http://localhost:3000/getUsername/${localSessionID}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          setServerUsername(data.username || 'Unknown');
        })
        .catch(error => {
          console.error('Error retrieving server data:', error);
          setServerUsername('Error retrieving username');
        });
    }
  }
    return <>
    
    <div className="dev-button">
    <button onClick ={updateData}>Update Server Data Debug</button>
    </div>
    <div className="dev-data">
    <p>Local Username: {username}</p>
    <p>Session ID: {sessionID}</p>
    <p>Server Username: {serverUsername}</p>
    </div>
    
    
    </>

}

export default DebugButton