const MoviesService = require("../src/movies/movies-service");
const knex = require("knex");
const { expect } = require("chai");
const { test } = require("mocha");

describe(`Movies service object`, function () {
  let db;
  let testMovies = [
    {
      id: 1,
      datecreated: new Date("2029-01-22T16:28:32.615Z"),
      title: "Tom & Jerry",
      poster_path: "/6KErczPBROQty7QoIsaa6wJYXZi.jpg",
      voter_average: 7.7,
    },
    {
      id: 2,
      datecreated: new Date("2100-05-22T16:28:32.615Z"),
      title: "Coming 2 America",
      poster_path: "/nWBPLkqNApY5pgrJFMiI9joSI30.jpg",
      voter_average: 7.1,
    },
    {
      id: 3,
      datecreated: new Date("1919-12-22T16:28:32.615Z"),
      title: "Monster Hunter",
      poster_path: "/1UCOF11QCw8kcqvce8LKOO6pimh.jpg",
      voter_average: 7.3,
    },
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => {
    return db.into("movies").insert(testMovies);
  });

  after(() => db.destroy());

  describe(`getAllMovies()`, () => {
    it(`resolves all movies from 'movies' table`, () => {
      // test that ArticlesService.getAllArticles gets data from table
      return MoviesService.getAllMovies(db).then((actual) => {
        expect(actual).to.eql.apply(testMovies);
      });
    });
  });
});
