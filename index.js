"use strict";

const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);

const Routes = require("./routes/routes");
const express = require("express"),
  bodyParser = require("body-parser"),
  app = express().use(bodyParser.json());

const router = express.Router();

Routes.initializeRoute(router);

app.get("/", (req, res) => {
  res.status(200).send("<h3>Welcome To TalkingTo<h3>");
});
app.use(router);
app.listen(process.env.PORT || 1234, () => console.log("webhook is listening"));
