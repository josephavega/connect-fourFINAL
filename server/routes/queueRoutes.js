// server/routes/queueRoutes.js
const express = require('express');
const Queue = require('../utils/queue/Queue'); // Import Queue logic

const userHashMap = new Map();
const router = express.Router();

router.get('/', (req, res) => {
  console.log(`Queue Requested : ${Queue.queue}`);
  res.json({ users: Queue.queue || [] });
});

router.post('/joinQueue', (req, res) => {
  const { username, sessionID } = req.body;
  console.log(`API Request: POST /joinQueue, username: ${username}, sessionID: ${sessionID}`);
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  } else if (!Queue.containsPlayer(username)) {
    Queue.addPlayer(username);
    userHashMap.set(sessionID, username);
    return res.json({ message: `${username} added to the queue.`, queue: Queue.queue });
  } else {
    return res.status(400).json({ error: 'Player is already in the queue' });
  }
});

router.post('/leaveQueue', (req, res) => {
  const { sessionID } = req.body;
  const username = userHashMap.get(sessionID);
  console.log(`API Request: POST /leaveQueue, username: ${username}`);

  if (Queue.containsPlayer(username)) {
    Queue.removePlayer(username);
    userHashMap.delete(sessionID);
    return res.json({ message: `${username} left the queue.`, queue: Queue.queue });
  } else {
    return res.status(400).json({ error: 'Player is not in the queue' });
  }
});

module.exports = router;
