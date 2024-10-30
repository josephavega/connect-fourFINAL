// server/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const session = require('express-session');
const { Server } = require('socket.io');
const config = require('./config/config.json');
const GameLogic = require('./utils/game/Manager');
const Queue = require('./utils/queue/Queue');



// Import routes and socket handlers
const queueRoutes = require('./routes/queueRoutes');
const gameRoutes = require('./routes/gameRoutes');
const queueSocketHandler = require('./sockets/queueSocket');
const gameSocketHandler = require('./sockets/gameSocket');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
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

io.on('connection', (socket) => {
  queueSocketHandler(socket, io);
  gameSocketHandler(socket, io);
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});