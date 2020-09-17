const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


io.on('connection', (socket) => {
  console.log("A user connected");
  socket.on('connect-to-room', (roomId) => {
    socket.join(roomId);
    socket.on('sendSound', (soundInfo) => {
      console.log(`Sending sound with id "${soundInfo.soundId}" to clients in room "${roomId}"`);
      io.to(roomId).emit('reciveSound', soundInfo);
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log("Your app is listening on port " + port);
});