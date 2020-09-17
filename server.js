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
  console.log(socket.rooms);
  socket.on('sendSound', (data) => {
    console.log("Sending sound to clients:", data);
    io.emit('reciveSound', data);
  });

  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

server.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT);
});
