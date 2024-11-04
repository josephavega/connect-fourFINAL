import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import '../styles/queue.css';

const Queue = () => {
  const [queue, setQueue] = useState([]); // Initialize as an empty array to avoid undefined

  useEffect(() => {
    // Connect to the queue socket and fetch the initial queue data
    queueSocket.emit('getQueue');

    // Listen for an updated queue from the server
    queueSocket.on('queueUpdated', (updatedQueue) => {
      console.log('Queue updated:', updatedQueue);
      setQueue(updatedQueue); // Update the queue state with the new list
    });

    // Cleanup to remove listeners on component unmount
    return () => {
      queueSocket.off('queueUpdated');
    };
  }, []); // Run only once on component mount

  useEffect(() => {
    console.log('Queue state updated:', queue); // Log whenever queue state updates
  }, [queue]);

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
