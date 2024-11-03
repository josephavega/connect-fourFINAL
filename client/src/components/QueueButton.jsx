import React, { useState, useEffect } from 'react';
import queueSocket from 'socket.io-client'; 
import { v4 as uuidv4 } from 'uuid'; 

let sessionID = localStorage.getItem('sessionID');
if (!sessionID) {
  sessionID = uuidv4();
  localStorage.setItem('sessionID', sessionID);
}

const QueueButton = () => {
  const [inQueue, setInQueue] = useState(false); // State to track if the user is in the queue
  const [loading, setLoading] = useState(true);  // State to track loading status during initial fetch

  useEffect(() => {
    // Check initial queue status from server
    fetch('http://localhost:3000/isInQueue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionID }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Initial Queue Status:', data);
        setInQueue(data.inQueue);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error checking queue status:', error);
        setLoading(false);
      });
  }, []); // Empty dependency array to run only on component mount

  const toggleQueueStatus = () => {
    const endpoint = inQueue ? 'leaveQueue' : 'joinQueue';

    fetch(`http://localhost:3000/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionID }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`${inQueue ? 'Leave' : 'Join'} Queue Response:`, data);
        setInQueue(!inQueue); // Toggle inQueue status after success
      })
      .catch(error => {
        console.error(`Error ${inQueue ? 'leaving' : 'joining'} queue:`, error);
        alert(`Failed to ${inQueue ? 'leave' : 'join'} the queue.`);
      });
  };


  return (
    <>
      <button onClick={toggleQueueStatus}>
        {inQueue ? 'Leave Queue' : 'Join Queue'}
      </button>
      {/* Other UI components */}
    </>
  );
};

export default QueueButton;
