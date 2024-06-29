const express = require("express");
const authRouter = require("./auth");
const participantRouter = require("./participant");
const sessionRouter = require("./session");
const { checkAuth, isLogged } = require("../middlewares/auth");

const auth = require("../middlewares/auth");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const v1Router = express.Router();

v1Router.use(express.json());
v1Router.use(express.urlencoded({ extended: true }));
v1Router.use(
  cors({
    origin: (origin, callback) => callback(null, true), // allow all origins (for now
    credentials: true,
  })
);
v1Router.use(cookieParser());
// no need to use checkAuth and isLogged middlewares here
v1Router.use("/auth", authRouter);

// all routes below this line will require authentication
v1Router.use(checkAuth, isLogged);
v1Router.use("/participants", participantRouter);
v1Router.use("/sessions", sessionRouter);

module.exports = v1Router;
