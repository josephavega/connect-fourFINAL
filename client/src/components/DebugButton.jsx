import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/connectPopup.css";
import gameSocket from '../sockets/gameSocket';
import '../styles/debugButton.css'

const DebugButton = () => {

  const [username, setUsername] = useState('');
  const [sessionID, setSessionID] = useState(null);
  const [serverUsername, setServerUsername] = useState('');
  const [board, setBoard] = useState('');


  function joinTeam(team) {
    const localUsername = localStorage.getItem('username');
    const localSessionID = localStorage.getItem('sessionID');
    
    const data = {localUsername, team, localSessionID};
    gameSocket.emit('joinGame', data);
    

  }

  function updateData() {

    const localUsername = localStorage.getItem('username');
    const localSessionID = localStorage.getItem('sessionID');

    

    setUsername(localUsername);
    setSessionID(localSessionID);

    gameSocket.emit('getBoard', (response) => {
      const {board} = response;
      if (response.error) {
        console.error('Error getting board:', response.error);
      } else {
             setBoard(board);
             console.log('Board received:', board);
      }
    });
    
    gameSocket.on('sentBoard', (board) => {
      setBoard(board);
      console.log('Board updated:', board);
    });
    


    // Fetch user data from the server using the session ID
    if (localSessionID) {
        fetch(`http://localhost:3000/queue/getUsername/${localSessionID}`)
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
    <button onClick={joinTeam(0)}>Join Red</button>
    <button onClick ={updateData}>Update Server Data Debug</button>
    <button onClick={joinTeam(1)}>Join Yellow</button>
    </div>
    <div className="dev-data">
    <p>Local Username: {username}</p>
    <p>Session ID: {sessionID}</p>
    <p>Server Username: {serverUsername}</p>
    </div>
    
    
    </>

}

export default DebugButton