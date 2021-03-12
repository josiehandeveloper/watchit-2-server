const express = require("express");
const MoviesService = require("./movies-service");

const moviesRouter = express.Router();
const jsonParser = express.json();

moviesRouter
  .route("/")
  .get((req, res, next) => {
    MoviesService.getAllMovies(req.app.get("db"))
      .then((movies) => {
        res.json(movies);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, poster_path, vote_average } = req.body;
    const newMovie = { title, poster_path, vote_average };

    MoviesService.insertMovie(req.app.get("db"), newMovie)
      .then((movie) => {
        res.status(201).location(req.originalUrl).json(movie);
      })
      .catch(next);
  });

module.exports = moviesRouter;
