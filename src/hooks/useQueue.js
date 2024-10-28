import { useState } from 'react';
import initialQueue from '../data/queue.json';

function useQueue() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const savedQueue = JSON.parse(localStorage.getItem('queue'));
    if (savedQueue) {
      setQueue(savedQueue);
    } else {
      setQueue(initialQueue); // Load initial data if no saved data exists
    }
  }, []);
  
// Save queue to localStorage whenever it updates
useEffect(() => {
    localStorage.setItem('queue', JSON.stringify(queue));
  }, [queue]);

  const addPlayer = (player) => {
    setQueue((prevQueue) => [...prevQueue, player]);
  };

  const removePlayer = () => {
    if (queue.length > 0) {
      setQueue((prevQueue) => prevQueue.slice(1));
    }
  };

  return { queue, addPlayer, removePlayer };
}

export default useQueue;

