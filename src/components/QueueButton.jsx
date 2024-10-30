import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client'; 
import { v4 as uuidv4 } from 'uuid'; 

let sessionID = localStorage.getItem('sessionID');
if (!sessionID) {
  sessionID = uuidv4();
  localStorage.setItem('sessionID', sessionID);
}

let socket = null;

const QueueButton = () => {
  const [inQueue, setInQueue] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    if (!socket) {
      socket = io('http://localhost:3000', {
        query: {
          sessionID,
        },
      });
    }

    // Listen for queue updates from the server
    socket.on('queueUpdated', (queue) => {
      const isInQueue = queue.includes(sessionID);
      setInQueue(isInQueue);
    });

    // Clean up event listeners and socket connection when component unmounts
    return () => {
      socket.off('queueUpdated');
      // Optionally: socket.disconnect(); // You can disconnect if you no longer need the connection when the component unmounts.
    };
  }, []);

  const toggleQueueStatus = () => {
    const sessionID = localStorage.getItem('sessionID');
  
    if (inQueue) {
      // Leave the queue using API request
      fetch('http://localhost:3000/leaveQueue', {
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
          console.log('Leave Queue Response:', data);
          setInQueue(false);
        })
        .catch(error => {
          console.error('Error leaving queue:', error);
          alert('Failed to leave the queue.');
        });
    } else {
      // Join the queue using API request
      fetch('http://localhost:3000/joinQueue', {
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
          console.log('Join Queue Response:', data);
          setInQueue(true);
        })
        .catch(error => {
          console.error('Error joining queue:', error);
          alert('Failed to join the queue.');
        });
    }
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
