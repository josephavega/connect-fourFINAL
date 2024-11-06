import React, { useState, useEffect } from 'react';
import queueSocket from '../sockets/queueSocket';
import '../styles/queue.css';

const Queue = () => {
  const [queue, setQueue] = useState([]); // Initialize as an empty array to avoid undefined

  useEffect(() => {
    // Emit the request for the initial queue
 
    let sessionID = localStorage.getItem('sessionID');
  
    // Event listener function
    const handleQueueUpdate = (updatedQueue) => {
      console.log('Queue updated:', updatedQueue);
      setQueue(updatedQueue); // Update the queue state with the new list
    };
  
    // Attach the event listener
    queueSocket.on('queueUpdated', handleQueueUpdate);
  
 
    const startHeartbeat = () => {
      console.log('Socket connected, starting heartbeat...');
      return setInterval(() => {
        if (queueSocket && queueSocket.connected) {
          queueSocket.emit('heartbeat', sessionID);
          console.log('Heartbeat');
        }
      }, 5000);
    };

    let heartbeatInterval = startHeartbeat();

    queueSocket.emit('getQueue');
   // Cleanup function to remove the event listener
   return () => {
    clearInterval(heartbeatInterval);
    queueSocket.off('queueUpdated', handleQueueUpdate);
    
  };
  }, []);

  // Create the list of players dynamically using map
  const queueList = queue.length > 0 ? (
    queue.map((player, index) => (
      <li key={index}>{player.username}</li>
    ))
  ) : (
    <li>No players in the queue</li>
  );
  
  return (
    <div className="queue-container">
      <h2>Queue</h2>
      <div className="queue-table">
        <ul>
          {queueList}
        </ul>
      </div>
    </div>
  );
};

export default Queue;
