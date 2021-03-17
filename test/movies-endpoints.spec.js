const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const authRouter = require("../src/auth/auth-router");
const { makeUsersArr } = require("./users.fixtures");
const { makeMoviesArr } = require("./movies.fixtures");

describe.only("Movies Endpoints", function () {
  let db;
  let authToken;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  before("clean the table", () => db("movies", "users").truncate());

  afterEach("cleanup", () => db("movies", "users").truncate());

  before("register and login", () => {
    let user = { email: "testuser@test.com", password: "Password1!" };
    supertest(app)
      .post("/api/users")
      .send(user)
      .then((res) => {
        supertest(app)
          .post("/api/auth/login")
          .send(user)
          .then((res2) => {
            authToken = res2.body.authToken;
          });
      });
  });

  describe("GET /api/movies", () => {
    context("Given there are movies in the db", () => {
      const testUsers = makeUsersArr();
      const testMovies = makeMoviesArr();

      beforeEach("insert users", () => {
        return db.into("users").insert(testUsers);
      });
      beforeEach("insert movies", () => {
        return db.into("movies").insert(testMovies);
      });

      it("responds with 200 and all of the movies", () => {
        return supertest(app)
          .get("/api/movies")
          .set("Authorization", `Bearer ${authToken}`)
          .expect(200, testMovies);
      });
    });

    context(`Given no movies`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest("app")
          .get("/api/movies")
          .set("Authorization", `Bearer ${authToken}`)
          .expect(200, []);
      });
    });
  });

  describe(`POST /api/movies`, () => {
    beforeEach("insert users", () => {
      return db.into("users").insert(testUsers);
    });

    it("creates a movie and responds with 201 and the object", () => {
      const newMovie = {
        title: "test1",
        overview: "testoverview",
        poster_path: "test posterpath",
        vote_average: 7,
        user_id: 1,
        datecreated: "2020-10-21",
        id: 500,
      };

      return supertest(app)
        .post("/api/movies")
        .send(newMovie)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(newMovie.title);
          expect(res.body.poster_path).to.eql(newMovie.poster_path);
          expect(res.body.user_id).to.eql(newMovie.user_id);
          expect(res.headers.location).to.eql(`/api/movies`);
        })
        .then((postRes) => {
          return supertest(app)
            .get(`/api/movies/${postRes.body.id}`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(postRes.body);
        });
    });
  });

  describe(`DELETE /api/movies`, () => {
    context("Given there are movies in the db", () => {
      const testMovies = makeMoviesArr();

      beforeEach("insert movies", () => {
        return db.into("movies").insert(testMovies);
      });

      it("responds with 204 and removes the movie", () => {
        const idToRemove = 2;
        const expectedMovies = testMovies.filter(
          (movie) => movie.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/movies/`)
          .send({ movie_id: idToRemove })
          .set("Authorization", `Bearer ${authToken}`)
          .expect(expectedMovies);
      });
    });
  });
});
