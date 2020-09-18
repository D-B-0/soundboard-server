const express = require("express");
const router = express.Router();

const soundsRouter = require("./soundRouter");

router.use("/sounds", soundsRouter);

module.exports = router;