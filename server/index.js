import express from 'express';
import http from 'http';
import cors from 'cors';
import session from 'express-session';
import { Server } from 'socket.io';
import config from './config/config.json' assert { type: 'json' };
import Manager from './utils/game/Manager.js';
import Queue from '../client/src/server/queue/Queue.js';
import users from './utils/users.js';


// Import routes and socket handlers
import queueRoutes from './routes/queueRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import queueSocketHandler from './sockets/queueSocket.js';
import gameSocketHandler from './sockets/gameSocket.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Session middleware
const sessionMiddleware = session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});
app.use(sessionMiddleware);

// Apply routes
app.use('/queue', queueRoutes);
app.use('/game', gameRoutes);

// Socket connection handler
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});


queueSocketHandler(io);
gameSocketHandler(io);


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  users.printStatus();

});
