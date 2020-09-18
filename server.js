// ===============
// ==Setup stuff==
// ===============

require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// ====================
// ==Middleware stuff==
// ====================

app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.static("public"));

// =================
// ==Routing stuff==
// =================

const apiRouter = require("./routers");
app.use("/api", apiRouter);

// Error handler

app.use((err, req, res, next) => {
  const {
    message,
    stack,
  } = err;
  res.status(err.status || 500).send({
    message,
    stack: process.env.DEVELOPMENT ? stack : '🥞',
  });
});

// ================
// ==Socket stuff==
// ================

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("connect-to-room", (roomId) => {
    console.log(`A user connected to room "${roomId}"`);
    socket.join(roomId);
    socket.on("sendSound", (soundInfo) => {
      console.log(`Sending sound with id "${soundInfo.soundId}" to clients in room "${roomId}"`);
      io.to(roomId).emit("reciveSound", soundInfo);
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// ================
// ==Start server==
// ================

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log("Your app is listening on port " + port);
});