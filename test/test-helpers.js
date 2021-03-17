// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const config = require("../src/config");

// function makeUsersArr() {
//   return [
//     {
//       id: 1,
//       email: "test-user-1@test.com",
//       password: "Test-user-1!",
//     },
//     {
//       id: 2,
//       email: "test-user-2@test.com",
//       password: "Test-user-2!",
//     },
//     {
//       id: 3,
//       email: "test-user-3@test.com",
//       password: "Test-user-3!",
//     },
//   ];
// }

// function makeMoviesArr(users) {
//   return [
//     {
//       id: 1,
//       title: "Wonder Woman 1984",
//       poster_path: "/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
//       user_id: users[0].id,
//       vote_average: 7.2,
//       datecreated: new Date("2029-01-22T16:28:32.615Z"),
//     },
//     {
//       id: 2,
//       title: "Soul",
//       poster_path: "/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg",
//       user_id: users[1].id,
//       vote_average: 8.3,
//       datecreated: new Date("2029-01-22T16:28:32.615Z"),
//     },
//     {
//       id: 3,
//       title: "Shadow in the Cloud",
//       poster_path: "/t7EUMSlfUN3jUSZUJOLURAzJzZs.jpg",
//       user_id: users[2].id,
//       vote_average: 6.1,
//       datecreated: new Date("2029-01-22T16:28:32.615Z"),
//     },
//   ];
// }

// function makeExpectedMovie(users, movie) {
//   const user = users.find((user) => user.id === movie.user_id);

//   return {
//     id: movie.id,
//     title: movie.title,
//     overview: movie.overview,
//     datecreated: movie.datecreated.toISOString(),
//     user_id: {
//       id: user.id,
//       email: user.email,
//       datecreated: user.datecreated.toISOString(),
//     },
//   };
// }

// function makeMaliciousMovie(user) {
//   const maliciousMovie = {
//     id: 911,
//     title: "How-to",
//     overview: 'Naughty naughty very naughty <script>alert("xss");</script>',
//     poster_path: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
//     user_id: user.id,
//     vote_average: 7,
//     datecreated: new Date(),
//   };
//   const expectedMovie = {
//     ...makeExpectedMovie([user], maliciousMovie),
//     overview:
//       'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
//     poster_path: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
//   };
//   return {
//     maliciousMovie,
//     expectedMovie,
//   };
// }

// function makeMoviesFixtures() {
//   const testUsers = makeUsersArr();
//   const testMovies = makeMoviesArr(testUsers);
//   return { testUsers, testMovies };
// }

// function cleanTables(db) {
//   return db.transaction((trx) =>
//     trx
//       .raw(
//         `TRUNCATE
//         "movies",
//         "users"
//       `
//       )
//       .then(() =>
//         Promise.all([
//           trx.raw(`ALTER SEQUENCE movies_id_seq minvalue 0 START WITH 1`),
//           trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
//           trx.raw(`SELECT setval('movies_id_seq', 0)`),
//           trx.raw(`SELECT setval('users_id_seq', 0)`),
//         ])
//       )
//   );
// }

// function seedUsers(db, users) {
//   const preppedUsers = users.map((user) => ({
//     ...user,
//     password: bcrypt.hashSync(user.password, 1),
//   }));
//   return db
//     .into("movies")
//     .insert(preppedUsers)
//     .then(() =>
//       db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
//     );
// }

// function seedMoviesTables(db, users, movies) {
//   return db.transaction(async (trx) => {
//     await trx.into("users").insert(users);
//     await trx.into("movies").insert(movies);

//     await Promise.all([
//       trx.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id]),
//       trx.raw(`SELECT setval('movies_id_seq', ?)`, [
//         movies[movies.length - 1].id,
//       ]),
//     ]);
//   });
// }

// function seedMaliciousMovie(db, user, movie) {
//   return seedUsers(db, [user]).then(() => db.into("movies").insert([movie]));
// }

// function makeAuthHeader(user, secret = config.JWT_SECRET) {
//   const token = jwt.sign({ user_id: user.id }, secret, {
//     subject: user.email,
//     algorithm: "HS256",
//   });
//   return `Bearer ${token}`;
// }

// module.exports = {
//   makeUsersArr,
//   makeMoviesArr,
//   makeExpectedMovie,
//   makeMoviesFixtures,
//   cleanTables,
//   seedMoviesTables,
//   makeMaliciousMovie,
//   seedMaliciousMovie,
//   makeAuthHeader,
//   seedUsers,
// };
