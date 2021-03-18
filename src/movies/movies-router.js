const express = require("express");
const knex = require("knex");
const xss = require("xss");
const MoviesService = require("./movies-service");
const { requireAuth } = require("../middleware/jwt-auth");
const path = require("path");

const MoviesRouter = express.Router();
const jsonParser = express.json();

MoviesRouter.route("/")
  .get(requireAuth, (req, res, next) => {
    MoviesService.getAllMoviesByUser(req.app.get("db"), req.user.id)
      .then((movies) => {
        if (!movies) {
          return res.status(404).json({
            error: { message: `No movies` },
          });
        }
        res.json(movies);
      })
      .catch(next);
  })

  .delete(requireAuth, jsonParser, (req, res, next) => {
    const { movie_id } = req.body;
    MoviesService.deleteMovie(req.app.get("db"), movie_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { title, poster_path, vote_average } = req.body;
    const newMovie = {
      title,
      poster_path,
      user_id: req.user.id,
      vote_average,
    };

    if (req.body.id) {
      newMovie.id = req.body.id;
    }

    MoviesService.insertMovie(req.app.get("db"), newMovie)
      .then((movie) => {
        res.status(201).location(path.posix.join(`/movies`)).json(movie);
      })
      .catch(next);
  });

module.exports = MoviesRouter;
