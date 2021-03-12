const MoviesService = {
  getAllMovies(knex) {
    return knex.select("*").from("movies");
  },
  getAllMoviesByUser(knex, user_id) {
    return knex.from("movies").select("*").where({ user_id }).first();
  },
  insertMovie(knex, newMovie) {
    return knex
      .insert(newMovie)
      .into("movies")
      .returning("*")
      .then((row) => {
        return row[0];
      });
  },
  deleteMovie(knex, id) {
    return knex("movies").where({ id }).delete();
  },
};
module.exports = MoviesService;
