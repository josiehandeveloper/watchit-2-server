require("dotenv").config();
const knex = require("knex");
const MoviesService = require("./movies-service");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL,
});

console.log(MoviesService.getAllMovies());
