const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe.only("Movies Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("movies").truncate());

  context("Given there are movies in the database", () => {
    const testMovies = [
      {
        id: 1,
        datecreated: new Date("2029-01-22T16:28:32.615Z"),
        title: "Tom & Jerry",
        poster_path: "/6KErczPBROQty7QoIsaa6wJYXZi.jpg",
        vote_average: 7.7,
      },
      {
        id: 2,
        datecreated: new Date("2100-05-22T16:28:32.615Z"),
        title: "Coming 2 America",
        poster_path: "/nWBPLkqNApY5pgrJFMiI9joSI30.jpg",
        vote_average: 7.1,
      },
      {
        id: 3,
        datecreated: new Date("1919-12-22T16:28:32.615Z"),
        title: "Monster Hunter",
        poster_path: "/1UCOF11QCw8kcqvce8LKOO6pimh.jpg",
        vote_average: 7.3,
      },
    ];

    beforeEach("insert movies", () => {
      return db.into("movies").insert(testMovies);
    });

    it("GET /movies responds with 200 and all of the movies", () => {
      return supertest(app).get("/movies").expect(200, testMovies);
    });
  });
});
