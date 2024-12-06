import express from "express";
import http from "http";
import cors from "cors";
import session from "express-session";
import { Server } from "socket.io";
import Manager from "./utils/game/Manager.js";

// Import routes and socket handlers
import queueRoutes from "./routes/queueRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import queueSocketHandler from "./sockets/queueSocket.js";
import gameSocketHandler from "./sockets/gameSocket.js";

import Users from "./utils/users.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// Session middleware
const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});
app.use(sessionMiddleware);

// Apply routes
app.use("/queue", queueRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/game", gameRoutes);

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
  //Manager.startAIvsAI();
});
