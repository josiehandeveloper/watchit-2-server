require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV, CLIENT_ORIGIN } = require("./config");
const app = express();
const morganOption = NODE_ENV === "production" ? "tiny" : "common";
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");
const MoviesRouter = require("./movies/movies-router");

app.use(express.json());
app.use(morgan(morganOption));
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/movies", MoviesRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: "server error" };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
