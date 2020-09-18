const express = require("express");
const router = express.Router();

const Joi = require("joi");
const db = require("monk")(process.env.MONGODB_URI);
const sounds = db.get("sounds");
const soundSchema = Joi.object({
  url: Joi.string()
    .required()
    .uri(),
  name: Joi.string().required(),
  approved: Joi.bool(),
});
const soundUpdateSchema = Joi.object({
  url: Joi.string()
    .uri(),
  name: Joi.string(),
  approved: Joi.bool(),
});

// Get all
router.get("/", async (req, res) => {
  res.send(await sounds.find());
});

// Get one
router.get("/:id", async (req, res, next) => {
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
router.post("/", async (req, res, next) => {
  try {
    Joi.assert(req.body, soundSchema);
    req.body.approved = req.signedCookies.loggedIn == "true" ? true : false;
    res.send(await sounds.insert(req.body));
  } catch (error) {
    const err = new Error(error.details[0].message);
    err.status = 400;
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    Joi.assert(req.body, soundUpdateSchema);
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

router.delete("/:id", async (req, res, next) => {
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

module.exports = router;