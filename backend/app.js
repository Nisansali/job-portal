const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./lib/passportConfig");
const cors = require("cors");
const fs = require("fs");

// MongoDB
mongoose
    .connect("mongodb://localhost:27017/jobPortal", {
    })
    .then((res) => console.log("Connected to DB"))
    .catch((err) => console.log(err));

// initialising directories
if (!fs.existsSync("./public")) {
    fs.mkdirSync("./public");
}
if (!fs.existsSync("./public/resume")) {
    fs.mkdirSync("./public/resume");
}
if (!fs.existsSync("./public/profile")) {
    fs.mkdirSync("./public/profile");
}

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Routing
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));

module.exports = app