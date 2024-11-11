// server/routes/queueRoutes.js
import express from 'express';
import users from '../utils/users.js'; // Import users utility

const router = express.Router();

// POST /api/joinQueue: Add user to queue
router.post('/joinQueue', (req, res) => {
  const { sessionID, username } = req.body;

  if (!sessionID || !username) {
    return res.status(400).json({ success: false, error: 'SessionID and username are required' });
  }

  // Check if user is already in the queue
  if (users.userInQueue(sessionID)) {
    return res.status(409).json({ success: false, message: 'User is already in the queue' });
  }

  // Add the user to the queue
  users.addUser({ sessionID, username });
  users.addToQueue({ sessionID, username });

  // Return the updated queue
  const updatedQueue = users.getQueue();
  res.status(200).json({ success: true, message: 'Successfully joined the queue', queue: updatedQueue });
});

// GET /queue/current: Get current queue status
router.get('/getQueue', (req, res) => {
  console.log(`Queue Requested: ${JSON.stringify(users.getQueue())}`);
  res.json({ users: users.getQueue() || [] });
});

// GET /queue/isInQueue: Check if a user is in the queue
router.get('/isInQueue', (req, res) => {
  const { sessionID } = req.query;

  if (!sessionID) {
    return res.status(400).json({ success: false, error: 'SessionID is required' });
  }

  console.log(`Checking if sessionID ${sessionID} is in the queue`);

  // Check if the user is in the queue
  const inQueue = users.userInQueue(sessionID);
  res.json({ inQueue });
});

// GET /api/getUsername/:sessionID: Get username by sessionID
router.get('/getUsername/:sessionID', (req, res) => {
  const sessionID = req.params.sessionID;
  console.log(`API Request: GET /getUsername/${sessionID}`); // Log to see request

  if (users.userInQueue(sessionID)) {
    const user = users.getUser(sessionID); // Ensure this function returns the correct user object
    if (user && user.username) {
      console.log(`Username found for sessionID ${sessionID}: ${user.username}`); // Log to confirm username found
      res.json({ username: user.username });
    } else {
      res.status(404).json({ error: 'Username not found' });
    }
  } else {
    console.log(`SessionID not found in userHashMap: ${sessionID}`); // Log if sessionID is not found
    res.status(404).json({ error: 'User not found' });
  }
});

export default router;
