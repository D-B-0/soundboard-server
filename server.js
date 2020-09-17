require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const Joi = require("joi");
const db = require("monk")(process.env.MONGODB_URI);
const sounds = db.get("sounds");
const soundSchema = Joi.object({
  src: Joi.string()
    .required()
    .uri(),
  name: Joi.string().required()
});
const soundUpdateSchema = Joi.object({
  src: Joi.string()
    .uri(),
  name: Joi.string(),
  approved: Joi.bool(),
});

app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.static("public"));

// =================
// ==Routing stuff==
// =================

// Get all
app.get("/api/sounds", async (req, res) => {
  res.send(await sounds.find());
});

// Get one
app.get("/api/sounds/:id", async (req, res, next) => {
  try {
    let result = (await sounds.find({
      _id: req.params.id
    }))[0]
    if (result) res.send(result);
    else {
      const error = new Error("Not found 😢");
      error.status = 404;
      next(error);
    }
  } catch (err) {
    if (err.message == "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters") {
      err.message = "Invalid ID";
    }
    err.status = 400;
    next(err);
  }
});

// Post new
app.post("/api/sounds", async (req, res, next) => {
  try {
    Joi.assert(req.body, soundSchema);
    req.body.approved = false;
    res.send(await sounds.insert(req.body));
  } catch (error) {
    const err = new Error(error.details[0].message);
    err.status = 400;
    next(err);
  }
});

app.patch("/api/sounds/:id", async (req, res, next) => {
  try {
    Joi.assert(req.body, soundUpdateSchema);
    console.log(req.body);
    let result = await sounds.update({
      _id: req.params.id
    }, {
      $set: req.body
    });
    if (result.nModified != 0 && result.n != 0) {
      res.status(200).send();
    } else if (result.n == 0) {
      const err = new Error("Not found 😢");
      err.status = 404;
      next(err);
    } else {
      const err = new Error("Item already of specified value");
      err.status = 304;
      next(err);
    }
  } catch (err) {
    if (err.message == "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters") {
      err.message = "Invalid ID";
    } else if (err.details) {
      err = new Error(err.details[0].message);
    }
    err.status = 400;
    next(err);
  }
});

app.delete("/api/sounds/:id", async (req, res, next) => {
  let result = await sounds.remove({
    _id: req.params.id
  });
  if (result.deletedCount == 1) {
    res.status(200).send();
  } else {
    const err = new Error("Not found 😢");
    err.status = 404;
    next(err);
  }
});

// Error handler

app.use(function (err, req, res, next) {
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

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log("Your app is listening on port " + port);
});