const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { verifyToken } = require("./controllers/authController");
const { saveMessage } = require("./models/messageModel");
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

(async () => {
  const db = await connectDB();

  app.use("/api/auth", authRoutes(db));
  app.use("/api/chat", chatRoutes(db));

  const onlineUsers = {};

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("login", async (token) => {
      const user = verifyToken(token);
      if (!user) return;

      const dbUser = await db.collection("users").findOne({ username: user.username });
      onlineUsers[user.username] = { socketId: socket.id, image: dbUser.image };
      io.emit("onlineUsers", onlineUsers);
    });

    socket.on("joinRoom", ({ from, to }) => {
      const room = [from, to].sort().join("-");
      socket.join(room);
    });

    socket.on("chatMessage", async ({ from, to, text }) => {
      const room = [from, to].sort().join("-");
      const message = { from, to, text, time: new Date(), room };
      await saveMessage(db, message);
      io.to(room).emit("chatMessage", message);
    });

    socket.on("disconnect", () => {
      for (let user in onlineUsers) {
        if (onlineUsers[user].socketId === socket.id) delete onlineUsers[user];
      }
      io.emit("onlineUsers", onlineUsers);
    });
  });

  const PORT=process.env.PORT;
  server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
})();