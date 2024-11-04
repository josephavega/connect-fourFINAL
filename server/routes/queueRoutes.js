// server/routes/queueRoutes.js
import express from 'express';
import users from '../utils/Users.js'; // Import users utility

const router = express.Router();

router.get('/current', (req, res) => {
  console.log(`Queue Requested : ${Queue.queue}`);
  res.json({ users: Queue.queue || [] });
});


router.post('/isInQueue', (req, res) => {
  const { sessionID } = req.body;
  console.log(`Checking if sessionID ${sessionID} is in the queue`);

  // Assuming you have a method to check if the user is in the queue
  if (queue.includes(sessionID)) {
    res.json({ inQueue: true });
  } else {
    res.json({ inQueue: false });
  }
});

router.get('/getUsername/:sessionID', (req, res) => {
  const sessionID = req.params.sessionID;
  console.log(`API Request: GET /getUsername/${sessionID}`); // Log to see request

  if (users.userInQueue(sessionID)) {
      const username = users.get(sessionID);
      console.log(`Username found for sessionID ${sessionID}: ${username}`); // Log to confirm username found
      res.json({ username });
  } else {
      console.log(`SessionID not found in userHashMap: ${sessionID}`); // Log if sessionID is not found
      res.status(404).json({ error: 'User not found' });
  }
});




export default router;

